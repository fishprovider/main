import { send } from '@fishprovider/old-core/dist/libs/notif';
import newOrder from '@fishprovider/swap/dist/commands/newOrder';
import { botUser } from '@fishprovider/swap/dist/utils/account';
import { getPrices } from '@fishprovider/swap/dist/utils/price';
import { CopyVolumeMode, LockType, ProviderType } from '@fishprovider/utils/dist/constants/account';
import { OrderStatus, OrderType } from '@fishprovider/utils/dist/constants/order';
import { isLastRunExpired } from '@fishprovider/utils/dist/helpers/lastRunChecks';
import { buildCopyId, parseCopyId } from '@fishprovider/utils/dist/helpers/order';
import { isPausedWeekend } from '@fishprovider/utils/dist/helpers/pause';
import {
  getLotFromVolume, getVolumeFromLot, getVolumeRound,
} from '@fishprovider/utils/dist/helpers/price';
import type { Account, CopySettings } from '@fishprovider/utils/dist/types/Account.model';
import type { Order, OrderWithoutId } from '@fishprovider/utils/dist/types/Order.model';
import type { Price } from '@fishprovider/utils/dist/types/Price.model';

import type { OrderCopy } from '~types/Order.model';

const env = {
  dryRun: process.env.DRY_RUN,
};

const runs = {};

const symbolFullWeek = ['BTCUSD', 'ETHUSD'];

const getVolume = (
  account: Account,
  copySettings: CopySettings,
  parentOrder: Order,
  prices: Record<string, Price>,
) => {
  const {
    copyVolumeRatio = 1,
  } = account?.settings || {};
  const {
    copyVolumeMode, copyVolumeRatioFixed,
    copyVolumeLotFixed, copyVolumeLotMin, copyVolumeLotMax,
  } = copySettings;

  let volumeNew = parentOrder.volume * copyVolumeRatio;

  if (copyVolumeMode === CopyVolumeMode.fixedRatio && copyVolumeRatioFixed) {
    volumeNew = parentOrder.volume * copyVolumeRatioFixed;
  }

  if (copyVolumeLotMin || copyVolumeLotMax) {
    const { error, lot } = getLotFromVolume({
      providerType: account.providerType,
      symbol: parentOrder.symbol,
      prices,
      volume: volumeNew,
    });
    if (error || !lot) return { error };

    if (copyVolumeLotMin && lot < copyVolumeLotMin) {
      const { error: errorMin, volume } = getVolumeFromLot({
        providerType: account.providerType,
        symbol: parentOrder.symbol,
        prices,
        lot: copyVolumeLotMin,
      });
      if (errorMin || !volume) return { error: errorMin };
      volumeNew = volume;
    }

    if (copyVolumeLotMax && lot > copyVolumeLotMax) {
      const { error: errorMax, volume } = getVolumeFromLot({
        providerType: account.providerType,
        symbol: parentOrder.symbol,
        prices,
        lot: copyVolumeLotMax,
      });
      if (errorMax || !volume) return { error: errorMax };
      volumeNew = volume;
    }
  }

  if (copyVolumeMode === CopyVolumeMode.fixedLot && copyVolumeLotFixed) {
    const { error, volume } = getVolumeFromLot({
      providerType: account.providerType,
      symbol: parentOrder.symbol,
      prices,
      lot: copyVolumeLotFixed,
    });
    if (error || !volume) return { error };
    volumeNew = volume;
  }

  const { error, volume } = getVolumeRound({
    providerType: account.providerType,
    symbol: parentOrder.symbol,
    prices,
    volume: volumeNew,
  });
  if (error || !volume) return { error };

  return { volume };
};

const getNewOrders = (
  account: Account,
  parentId: string,
  copySettings: CopySettings,
  parentOrders: Order[],
  prices: Record<string, Price>,
) => {
  const { _id: providerId } = account;
  const ordersToNew: OrderWithoutId[] = [];
  parentOrders.forEach((parentOrder) => {
    const { volume, error } = getVolume(account, copySettings, parentOrder, prices);
    if (error || !volume) {
      Logger.info(`Failed to get volume for parentOrder ${parentOrder._id} to ${providerId}: ${error}`);
      return;
    }

    const copyId = buildCopyId(providerId, parentOrder);
    ordersToNew.push({
      copyId,
      label: `copy-${parentId}`,
      comment: `copy-${parentOrder.positionId}`,

      providerId,
      providerType: account.providerType,
      providerPlatform: account.providerPlatform,
      orderType: OrderType.market,
      status: OrderStatus.idea,

      symbol: parentOrder.symbol,
      direction: parentOrder.direction,
      volume,

      ...botUser,
    });
  });
  return ordersToNew;
};

const getParentOrdersToCopy = (
  account: Account,
  copyOrders: OrderCopy[],
  parentId: string,
  parentOrders: Order[],
) => {
  const copyOrderIds: Record<string, boolean> = {};
  copyOrders.forEach(({ copyId }) => {
    const res = parseCopyId(copyId);
    if (res.parentId !== parentId) return;
    copyOrderIds[copyId] = true;
  });

  const { _id: providerId, providerType } = account;

  return parentOrders.filter((parentOrder) => {
    if (isPausedWeekend()) {
      const isSymbolFullWeek = providerType === ProviderType.exness
        && symbolFullWeek.includes(parentOrder.symbol);
      if (!isSymbolFullWeek) return false;
    }

    const newCopyId = buildCopyId(providerId, parentOrder);
    return !copyOrderIds[newCopyId];
  });
};

const copyNewOrders = async (
  account: Account,
  copyOrders: OrderCopy[],
  parentId: string,
  copySettings: CopySettings,
  parentOrders: Order[],
) => {
  const { _id: providerId, providerType, locks = [] } = account;

  const lockedAccount = locks.find((item) => item.type === LockType.open);
  if (lockedAccount) return;

  const parentOrdersToCopy = getParentOrdersToCopy(account, copyOrders, parentId, parentOrders);
  if (!parentOrdersToCopy.length) return;

  const orderIds = parentOrdersToCopy.map((item) => item._id);
  if (
    !isLastRunExpired({
      runs,
      runId: `${providerId}-${parentId}`,
      timeUnit: 'seconds',
      timeAmt: 60,
      checkIds: orderIds,
    })
  ) return;

  const symbols = parentOrdersToCopy.map((item) => item.symbol);
  const prices = await getPrices(providerType, symbols);

  const ordersToNew = getNewOrders(
    account,
    parentId,
    copySettings,
    parentOrdersToCopy,
    prices,
  );
  if (!ordersToNew.length) return;

  const msg = `[copy] Copy ${ordersToNew.length} new orders`;
  Logger.debug(`[${providerId}] ${msg}`, ordersToNew);

  if (env.dryRun) return;

  for (const order of ordersToNew) {
    const count = await Mongo.collection('orders').countDocuments({
      providerId,
      copyId: order.copyId,
    });
    if (!count) {
      const key = `copy-${providerId}-${order.copyId}`;
      const isRunning = await Redis.get(key);
      if (isRunning) {
        const errMsg = `[copy] Duplicated copy newOrder ${key}. Skip in 5 mins!`;
        Logger.warn(`[${providerId}]`, errMsg);
        send(errMsg, [], `p-${providerId}`);
        return;
      }
      await Redis.set(key, `${Date.now()}`, { EX: 60 * 5 });

      const copyMsg = `[copy] Copying newOrder ${key}`;
      send(copyMsg, [], `p-${providerId}`);

      await newOrder({ order, options: { config: account.config, ...botUser } })
        .catch((err) => {
          Logger.error(`[copy] Failed to new order ${providerId} ${order.copyId} ${err.message}`, order);
        });
    } else {
      Logger.debug(`[copy] Already copied ${order.copyId}`);
    }
  }
};

export default copyNewOrders;
