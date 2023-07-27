import { send } from '@fishprovider/core/dist/libs/notif';
import updateOrderCTrader from '@fishprovider/ctrader/dist/commands/updateOrder';
import { OrderStatus as OrderStatusCTrader, PositionStatus } from '@fishprovider/ctrader/dist/constants/openApi';
import type { Config as ConfigCTrader } from '@fishprovider/ctrader/dist/types/Config.model';
import type { ProviderType } from '@fishprovider/utils/dist/constants/account';
import type { Config } from '@fishprovider/utils/dist/types/Account.model';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import type { Price } from '@fishprovider/utils/dist/types/Price.model';
import type { RedisSymbol } from '@fishprovider/utils/dist/types/Redis.model';
import type { AsyncReturnType } from 'type-fest';

import { getSymbols, parseSymbols } from '~utils/price';

import connectAndRun from '../connectAndRun';
import { transformOrder, transformPosition } from '../transform';

const transformResult = (
  res: AsyncReturnType<typeof updateOrderCTrader>,
  providerId: string,
  providerType: ProviderType,
  symbolIds: Record<string, RedisSymbol>,
) => {
  const { order, position } = res;
  if (!order || !position) {
    throw new Error('Failed to update order');
  }
  return {
    order: transformOrder(order, providerId, providerType, symbolIds),
    position: transformPosition({ ...order, ...position }, providerId, providerType, symbolIds),
    providerData: res,
  };
};

const updateOrder = async (params: {
  config: Config,
  prices?: Record<string, Price>,
  requestOrder: Order,
  stopLoss?: number,
  takeProfit?: number,
  limitPrice?: number,
  stopPrice?: number,
  volume?: number,
}) => {
  const {
    config, prices, requestOrder,
    stopLoss = requestOrder.stopLoss,
    takeProfit = requestOrder.takeProfit,
    limitPrice = requestOrder.limitPrice,
    stopPrice = requestOrder.stopPrice,
    volume = requestOrder.volume,
  } = params;
  const {
    providerId, providerType, orderId, userName,
  } = requestOrder;

  if (!orderId) {
    throw new Error('Missing orderId');
  }

  const result = await connectAndRun({
    providerId,
    handler: async (conn) => {
      const res = await updateOrderCTrader(conn, orderId, {
        stopLoss: stopLoss || undefined,
        takeProfit: takeProfit || undefined,
        limitPrice: limitPrice || undefined,
        stopPrice: stopPrice || undefined,
        volume: volume || undefined,
      });
      const { order, position } = res;
      if (!order
        || order.orderStatus !== OrderStatusCTrader.ORDER_STATUS_ACCEPTED
        || !position
        || position.positionStatus !== PositionStatus.POSITION_STATUS_CREATED
      ) {
        Logger.error(`[${providerId}] Failed to update order`, result);
        throw new Error('Failed to update order');
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
  const msg = `Updated ${orderId}: ${order.direction} ${order.volume} ${order.symbol} at ${order.limitPrice || order.stopPrice} SL ${order.stopLoss} TP ${order.takeProfit} by ${userName}`;
  Logger.debug(`[${providerId}]`, msg);
  Logger.debug('order', JSON.stringify(order));
  Logger.debug('position', JSON.stringify(position));
  send(msg, [], `p-${providerId}`);

  return transformedResult;
};

export default updateOrder;
