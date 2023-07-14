import { send } from '@fishprovider/core/dist/libs/notif';
import updatePosition from '@fishprovider/swap/dist/commands/updatePosition';
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

const getOrderToUpdate = (
  copyOrders: OrderCopy[],
  parentId: string,
  copySettings: CopySettings,
  parentOrders: Order[],
) => {
  if (!copySettings?.enableCopyOrderSLTP) return [];

  const ordersToUpdate: OrderCopy[] = [];
  copyOrders.forEach((copyOrder) => {
    const res = parseCopyId(copyOrder.copyId);
    if (res.parentId !== parentId) return;

    const parentOrder = parentOrders.find((item) => item._id === res.parentOrderId);
    if (!parentOrder) return;

    const { stopLoss, takeProfit } = parentOrder;

    if ((stopLoss && stopLoss !== copyOrder.stopLoss)
      || (takeProfit && takeProfit !== copyOrder.takeProfit)
    ) {
      ordersToUpdate.push({
        ...copyOrder,
        stopLoss,
        takeProfit,
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
  const { _id: providerId } = account;

  const ordersToUpdate = getOrderToUpdate(copyOrders, parentId, copySettings, parentOrders);
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
