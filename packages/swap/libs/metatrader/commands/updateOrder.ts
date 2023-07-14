import { send } from '@fishprovider/core/dist/libs/notif';
import updateOrderMetaTrader from '@fishprovider/metatrader/dist/commands/updateOrder';
import type { Config as ConfigMetaTrader } from '@fishprovider/metatrader/dist/types/Config.model';
import type { Config } from '@fishprovider/utils/dist/types/Account.model';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import _ from 'lodash';

import connectAndRun from '../connectAndRun';

const transformResult = (
  res: any,
) => ({
  order: res,
  position: res,
  providerData: res,
});

const updateOrder = async (params: {
  config: Config,
  requestOrder: Order,
  stopLoss?: number,
  takeProfit?: number,
  limitPrice?: number,
  stopPrice?: number,
  volume?: number,
}) => {
  const {
    config, requestOrder,
    stopLoss = requestOrder.stopLoss,
    takeProfit = requestOrder.takeProfit,
    limitPrice = requestOrder.limitPrice,
    stopPrice = requestOrder.stopPrice,
  } = params;
  const {
    providerId, orderId, userName,
  } = requestOrder;

  if (!orderId) {
    throw new Error('Missing orderId');
  }

  const orderToUpdate = {
    stopLoss: stopLoss || undefined,
    takeProfit: takeProfit || undefined,
    openPrice: limitPrice || stopPrice,
  };

  const result = await connectAndRun({
    providerId,
    handler: async (conn) => {
      const res = await updateOrderMetaTrader(conn, orderId, orderToUpdate);
      return {
        ..._.omit(requestOrder, ['providerData', 'updatedLogs']),
        ...orderToUpdate,
        ...res,
      };
    },
    config: config as ConfigMetaTrader,
  });

  const transformedResult = transformResult(result);

  const { order, position } = transformedResult;
  const msg = `Updated ${orderId}: ${order.direction} ${order.volume} ${order.symbol} at ${order.limitPrice || order.stopPrice} SL ${order.stopLoss} TP ${order.takeProfit} by ${userName}`;
  Logger.debug(`[${providerId}]`, msg);
  Logger.debug('order', JSON.stringify(order));
  Logger.debug('position', JSON.stringify(position));
  send(msg, [], `p-${providerId}`);

  return transformedResult;
};

export default updateOrder;
