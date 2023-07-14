import { send } from '@fishprovider/core/dist/libs/notif';
import cancelOrder from '@fishprovider/ctrader/dist/commands/cancelOrder';
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
  res: AsyncReturnType<typeof cancelOrder>,
  providerId: string,
  providerType: ProviderType,
  symbolIds: Record<string, RedisSymbol>,
) => {
  const { order, position } = res;
  if (!order || !position) {
    throw new Error('Failed to remove order');
  }
  return {
    order: transformOrder(order, providerId, providerType, symbolIds),
    position: transformPosition({ ...order, ...position }, providerId, providerType, symbolIds),
    providerData: res,
  };
};

const removeOrder = async (params: {
  config: Config,
  prices?: Record<string, Price>,
  requestOrder: Order;
}) => {
  const { config, prices, requestOrder } = params;
  const {
    providerId, providerType, orderId, userName,
  } = requestOrder;
  if (!orderId) {
    throw new Error('Missing orderId');
  }

  const result = await connectAndRun({
    providerId,
    handler: async (conn) => {
      const res = await cancelOrder(conn, orderId);
      const { order, position } = res;
      if (!order
        || order.orderStatus !== OrderStatusCTrader.ORDER_STATUS_CANCELLED
        || !position
        || position.positionStatus !== PositionStatus.POSITION_STATUS_CLOSED
      ) {
        Logger.error(`[${providerId}] Failed to remove order`, result);
        throw new Error('Failed to remove order');
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
