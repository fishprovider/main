import { send } from '@fishprovider/core/libs/notif';
import closePosition from '@fishprovider/metatrader/commands/closePosition';
import type { Config as ConfigMetaTrader } from '@fishprovider/metatrader/types/Config.model';
import type { Config } from '@fishprovider/utils/types/Account.model';
import type { Order } from '@fishprovider/utils/types/Order.model';
import _ from 'lodash';

import connectAndRun from '../connectAndRun';

const transformRemovePosition = (
  res: any,
) => ({
  order: res,
  position: res,
  deal: res,
  providerData: res,
});

const removePosition = async (params: {
  config: Config,
  requestOrder: Order,
  volume?: number,
}) => {
  const {
    config, requestOrder,
  } = params;
  const {
    providerId, positionId, userName,
  } = requestOrder;
  if (!positionId) {
    throw new Error('Missing positionId');
  }

  const result = await connectAndRun({
    providerId,
    handler: async (conn) => {
      const res = await closePosition(conn, positionId);
      return {
        ..._.omit(requestOrder, ['providerData', 'updatedLogs']),
        ...res,
      };
    },
    config: config as ConfigMetaTrader,
  });

  const transformedResult = transformRemovePosition(result);

  const { order, position, deal } = transformedResult;
  const {
    direction, volume: volumeClose, symbol, price,
  } = requestOrder;
  const {
    stopLoss, takeProfit,
  } = position;
  const msg = `Closed ${positionId}: ${direction} ${volumeClose} ${symbol} at ${price} SL ${stopLoss} TP ${takeProfit} by ${userName}`;
  Logger.debug(`[${providerId}]`, msg);
  Logger.debug('order', JSON.stringify(order));
  Logger.debug('position', JSON.stringify(position));
  Logger.debug('deal', JSON.stringify(deal));
  send(msg, [], `p-${providerId}`);

  return transformedResult;
};

export default removePosition;
