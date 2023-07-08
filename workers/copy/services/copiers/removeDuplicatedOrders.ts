import { send } from '@fishprovider/core/libs/notif';
import removePosition from '@fishprovider/swap/commands/removePosition';
import { botUser } from '@fishprovider/swap/utils/account';
import { isLastRunExpired } from '@fishprovider/utils/helpers/lastRunChecks';
import type { Account } from '@fishprovider/utils/types/Account.model';
import _ from 'lodash';

import type { OrderCopy } from '~types/Order.model';

const env = {
  dryRun: process.env.DRY_RUN,
};

const runs = {};

const getDuplicatedOrders = (copyOrders: OrderCopy[]) => {
  const groups = _.filter(
    _.groupBy(copyOrders, (order) => order.copyId),
    (group) => group.length > 1,
  );
  const ordersToClose = _.flatMap(groups, (group) => _.tail(group));
  return ordersToClose;
};

const removeDuplicatedOrders = async (account: Account, copyOrders: OrderCopy[]) => {
  const { _id: providerId } = account;

  const ordersToClose = getDuplicatedOrders(copyOrders);
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

  const msg = `[copy] Remove ${ordersToClose.length} duplicated orders`;
  Logger.debug(`[${providerId}] ${msg}`, ordersToClose);
  send(msg, [], `p-${providerId}`);

  if (env.dryRun) return;

  for (const order of ordersToClose) {
    await removePosition({ order, options: { config: account.config, ...botUser } })
      .catch((err) => {
        if (err.message.includes('POSITION_NOT_FOUND')) return;
        Logger.error(`[copy] Failed to remove order ${providerId} ${order._id} ${err.message}`);
      });
  }
};

export default removeDuplicatedOrders;
