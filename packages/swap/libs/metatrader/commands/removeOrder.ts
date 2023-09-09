import cancelOrder from '@fishprovider/metatrader/dist/commands/cancelOrder';
import type { Config as ConfigMetaTrader } from '@fishprovider/metatrader/dist/types/Config.model';
import { send } from '@fishprovider/old-core/dist/libs/notif';
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

const removeOrder = async (params: {
  config: Config,
  requestOrder: Order;
}) => {
  const { config, requestOrder } = params;
  const { providerId, orderId, userName } = requestOrder;
  if (!orderId) {
    throw new Error('Missing orderId');
  }

  const result = await connectAndRun({
    providerId,
    handler: async (conn) => {
      const res = await cancelOrder(conn, orderId);
      return {
        ..._.omit(requestOrder, ['providerData', 'updatedLogs']),
        ...res,
      };
    },
    config: config as ConfigMetaTrader,
  });

  const transformedResult = transformResult(result);

  const { order, position } = transformedResult;
  const {
    direction, volume, symbol, limitPrice, stopPrice, stopLoss, takeProfit,
  } = order;
  const msg = `Closed ${orderId}: ${direction} ${volume} ${symbol} at ${limitPrice || stopPrice} SL ${stopLoss} TP ${takeProfit} by ${userName}`;
  Logger.debug(`[${providerId}]`, msg);
  Logger.debug('order', JSON.stringify(order));
  Logger.debug('position', JSON.stringify(position));
  send(msg, [], `p-${providerId}`);

  return transformedResult;
};

export default removeOrder;
