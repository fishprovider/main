import { send } from '@fishprovider/core/dist/libs/notif';
import removePosition from '@fishprovider/swap/dist/commands/removePosition';
import { botUser } from '@fishprovider/swap/dist/utils/account';
import { getPrices } from '@fishprovider/swap/dist/utils/price';
import { isLastRunExpired } from '@fishprovider/utils/dist/helpers/lastRunChecks';
import { getProfit } from '@fishprovider/utils/dist/helpers/order';
import { getMajorPairs } from '@fishprovider/utils/dist/helpers/price';
import type { Account, CopySettings } from '@fishprovider/utils/dist/types/Account.model';
import _ from 'lodash';

import type { OrderCopy } from '~types/Order.model';

const env = {
  dryRun: process.env.DRY_RUN,
};

const runs = {};

const getOrdersToClose = async (
  account: Account,
  copyOrders: OrderCopy[],
  copySettings: CopySettings,
) => {
  if (!copySettings?.enabledEquitySL) return [];
  if (!copyOrders.length) return [];

  const {
    providerType,
    balance = 0,
    asset = 'USD',
  } = account;
  const {
    equitySLRatio = 0,
  } = copySettings;

  const prices = await getPrices(
    providerType,
    _.uniq([
      ...getMajorPairs(providerType),
      ...copyOrders.map((item) => item.symbol),
    ]),
  );
  const profit = getProfit(copyOrders, prices, asset);

  const equityRatio = ((balance + profit) * 100) / balance;
  if (equityRatio > equitySLRatio) return [];

  return copyOrders;
};

const checkEquitySL = async (
  account: Account,
  copyOrders: OrderCopy[],
  copySettings: CopySettings,
) => {
  const { _id: providerId } = account;

  const ordersToClose = await getOrdersToClose(account, copyOrders, copySettings);
  if (!ordersToClose.length) return;

  const orderIds = ordersToClose.map((item) => item._id);
  if (
    !isLastRunExpired({
      runs,
      runId: providerId,
      timeUnit: 'seconds',
      timeAmt: 60,
      checkIds: orderIds,
    })
  ) return;

  const msg = `[copy] Remove ${ordersToClose.length} orders when Equity/Balance < ${copySettings?.equitySLRatio}%`;
  Logger.debug(`[${providerId}] ${msg}`, ordersToClose);
  send(msg, [], `p-${providerId}`);

  if (env.dryRun) return;

  await Mongo.collection<Account>('accounts').updateOne(
    { _id: providerId },
    {
      $set: {
        'settings.enableCopyParent': false,
      },
    },
  );

  for (const order of ordersToClose) {
    await removePosition({ order, options: { config: account.config, ...botUser } })
      .catch((err) => {
        if (err.message.includes('POSITION_NOT_FOUND')) return;
        Logger.error(`[copy] Failed to remove order ${providerId} ${order._id} ${err.message}`);
      });
  }
};

export default checkEquitySL;
