import { send } from '@fishprovider/core/dist/libs/notif';
import updatePositionCTrader from '@fishprovider/ctrader/dist/commands/updatePosition';
import { OrderStatus as OrderStatusCTrader, PositionStatus } from '@fishprovider/ctrader/dist/constants/openApi';
import type { Config as ConfigCTrader } from '@fishprovider/ctrader/dist/types/Config.model';
import type { ProviderType } from '@fishprovider/utils/dist/constants/account';
import type { Config } from '@fishprovider/utils/dist/types/Account.model';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import type { Price } from '@fishprovider/utils/dist/types/Price.model';
import type { RedisSymbol } from '@fishprovider/utils/dist/types/Redis.model';
import _ from 'lodash';
import type { AsyncReturnType } from 'type-fest';

import { getSymbols, parseSymbols } from '~utils/price';

import connectAndRun from '../connectAndRun';
import { transformOrder, transformPosition } from '../transform';

const transformResult = (
  res: AsyncReturnType<typeof updatePositionCTrader>,
  providerId: string,
  providerType: ProviderType,
  symbolIds: Record<string, RedisSymbol>,
) => {
  const { order, position } = res;
  if (!order || !position) {
    throw new Error('Failed to update position');
  }
  return {
    order: transformOrder(order, providerId, providerType, symbolIds),
    position: transformPosition({ ...order, ...position }, providerId, providerType, symbolIds),
    providerData: res,
  };
};

const updatePosition = async (params: {
  config: Config,
  prices?: Record<string, Price>,
  requestOrder: Order,
  stopLoss?: number,
  takeProfit?: number,
}) => {
  const {
    config, prices, requestOrder,
    stopLoss = requestOrder.stopLoss,
    takeProfit = requestOrder.takeProfit,
  } = params;
  const {
    providerId, providerType, positionId, userName,
  } = requestOrder;

  if (!positionId) {
    throw new Error('Missing positionId');
  }

  const result = await connectAndRun({
    providerId,
    handler: async (conn) => {
      const res = await updatePositionCTrader(conn, positionId, {
        stopLoss: stopLoss || undefined,
        takeProfit: takeProfit || undefined,
      });
      const { order, position } = res;
      if (!order
        || order.orderStatus !== OrderStatusCTrader.ORDER_STATUS_ACCEPTED
        || !position
        || position.positionStatus !== PositionStatus.POSITION_STATUS_OPEN
      ) {
        Logger.error(`[${providerId}] Failed to update position`, res);
        throw new Error('Failed to update position');
      }
      return res;
    },
    config: config as ConfigCTrader,
  });

  const { symbolIds } = prices
    ? parseSymbols(Object.values(prices))
    : (await getSymbols(providerType));

  const transformedResult = transformResult(result, providerId, providerType, symbolIds);

  const { order, position } = transformedResult;
  const msg = `Updated ${positionId}: ${position.direction} ${position.volume} ${position.symbol} at ${position.price} SL ${position.stopLoss} TP ${position.takeProfit} by ${userName}`;
  Logger.debug(`[${providerId}]`, msg);
  Logger.debug('order', JSON.stringify(order));
  Logger.debug('position', JSON.stringify(position));
  send(msg, [], `p-${providerId}`);

  return transformedResult;
};

export default updatePosition;
