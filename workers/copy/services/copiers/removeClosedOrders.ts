import { send } from '@fishprovider/core/dist/libs/notif';
import removePosition from '@fishprovider/swap/dist/commands/removePosition';
import { botUser } from '@fishprovider/swap/dist/utils/account';
import { isLastRunExpired } from '@fishprovider/utils/dist/helpers/lastRunChecks';
import { parseCopyId } from '@fishprovider/utils/dist/helpers/order';
import type { Account, CopySettings } from '@fishprovider/utils/dist/types/Account.model';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';

import type { OrderCopy } from '~types/Order.model';

const env = {
  dryRun: process.env.DRY_RUN,
};

const runs = {};

const getClosedOrders = (
  copyOrders: OrderCopy[],
  parentId: string,
  copySettings: CopySettings,
  parentOrders: Order[],
) => {
  if (!copySettings?.enableCopyOrderClose) return [];

  const parentOrderIds = parentOrders.map((item) => item._id);

  const ordersToClose = copyOrders.filter(
    (order) => {
      const res = parseCopyId(order.copyId);
      if (res.parentId !== parentId) return false;
      if (!res.parentOrderId || parentOrderIds.includes(res.parentOrderId)) return false;
      return true;
    },
  );
  return ordersToClose;
};

const removeClosedOrders = async (
  account: Account,
  copyOrders: OrderCopy[],
  parentId: string,
  copySettings: CopySettings,
  parentOrders: Order[],
) => {
  const { _id: providerId } = account;

  const ordersToClose = getClosedOrders(copyOrders, parentId, copySettings, parentOrders);
  if (!ordersToClose.length) return;

  const orderIds = ordersToClose.map((item) => item._id);
  if (
    !isLastRunExpired({
      runs,
      runId: `${providerId}-${parentId}`,
      timeUnit: 'seconds',
      timeAmt: 60,
      checkIds: orderIds,
    })
  ) return;

  const msg = `[copy] Remove ${ordersToClose.length} closed orders`;
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

export default removeClosedOrders;
