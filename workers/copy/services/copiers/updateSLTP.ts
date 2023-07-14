import { send } from '@fishprovider/core/dist/libs/notif';
import updatePosition from '@fishprovider/swap/dist/commands/updatePosition';
import { botUser } from '@fishprovider/swap/dist/utils/account';
import { getPrices } from '@fishprovider/swap/dist/utils/price';
import { isLastRunExpired } from '@fishprovider/utils/dist/helpers/lastRunChecks';
import { parseCopyId } from '@fishprovider/utils/dist/helpers/order';
import type { Account, CopySettings } from '@fishprovider/utils/dist/types/Account.model';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import type { Price } from '@fishprovider/utils/dist/types/Price.model';
import _ from 'lodash';

import type { OrderCopy } from '~types/Order.model';

const env = {
  dryRun: process.env.DRY_RUN,
};

const runs = {};

const getOrderToUpdate = (
  copyOrders: OrderCopy[],
  parentId: string,
  copySettings: CopySettings,
  parentOrders: Order[],
  prices: Record<string, Price>,
) => {
  if (!copySettings?.enableCopyOrderSLTP) return [];

  const ordersToUpdate: OrderCopy[] = [];
  copyOrders.forEach((copyOrder) => {
    const res = parseCopyId(copyOrder.copyId);
    if (res.parentId !== parentId) return;

    const parentOrder = parentOrders.find((item) => item._id === res.parentOrderId);
    if (!parentOrder) return;

    const digits = prices[`${copyOrder.providerType}-${copyOrder.symbol}`]?.digits;

    const parentSL = parentOrder.stopLoss && digits
      ? _.round(parentOrder.stopLoss, digits) : parentOrder.stopLoss;
    const parentTP = parentOrder.takeProfit && digits
      ? _.round(parentOrder.takeProfit, digits) : parentOrder.takeProfit;

    if ((parentSL && parentSL !== copyOrder.stopLoss)
      || (parentTP && parentTP !== copyOrder.takeProfit)
    ) {
      ordersToUpdate.push({
        ...copyOrder,
        stopLoss: parentSL,
        takeProfit: parentTP,
      });
    }
  });

  return ordersToUpdate;
};

const updateSLTP = async (
  account: Account,
  copyOrders: OrderCopy[],
  parentId: string,
  copySettings: CopySettings,
  parentOrders: Order[],
) => {
  const { _id: providerId, providerType } = account;

  const symbols = copyOrders.map((item) => item.symbol);
  const prices = await getPrices(providerType, symbols);

  const ordersToUpdate = getOrderToUpdate(
    copyOrders,
    parentId,
    copySettings,
    parentOrders,
    prices,
  );
  if (!ordersToUpdate.length) return;

  const orderIds = ordersToUpdate.map((item) => item._id);
  if (
    !isLastRunExpired({
      runs,
      runId: `${providerId}-${parentId}`,
      timeUnit: 'seconds',
      timeAmt: 60,
      checkIds: orderIds,
    })
  ) return;

  const msg = `[copy] Update SLTP for ${ordersToUpdate.length} orders`;
  Logger.debug(`[${providerId}] ${msg}`, ordersToUpdate);
  send(msg, [], `p-${providerId}`);

  if (env.dryRun) return;

  for (const order of ordersToUpdate) {
    await updatePosition({
      order,
      options: {
        config: account.config,
        ...(order.stopLoss && { stopLoss: order.stopLoss }),
        ...(order.takeProfit && { takeProfit: order.takeProfit }),
        ...botUser,
      },
    }).catch((err) => {
      if (err.message.includes('Nothing to amend')) return;
      Logger.error(`[copy] Failed to update order ${providerId} ${order._id} ${err.message}`);
    });
  }
};

export default updateSLTP;
