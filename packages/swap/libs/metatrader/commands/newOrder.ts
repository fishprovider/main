import { send } from '@fishbot/core/libs/notif';
import newOrderMetaTrader from '@fishbot/metatrader/commands/newOrder';
import { ActionType } from '@fishbot/metatrader/constants/metaApi';
import type { Config as ConfigMetaTrader } from '@fishbot/metatrader/types/Config.model';
import type { ConnectionType } from '@fishbot/metatrader/types/Connection.model';
import { Direction, OrderStatus, OrderType } from '@fishbot/utils/constants/order';
import { getLotFromVolume } from '@fishbot/utils/helpers/price';
import random from '@fishbot/utils/helpers/random';
import type { Config } from '@fishbot/utils/types/Account.model';
import type { Order } from '@fishbot/utils/types/Order.model';
import type { Price } from '@fishbot/utils/types/Price.model';
import _ from 'lodash';

import { buildSymbol } from '~libs/metatrader/transform';
import { getSymbols, parseSymbols } from '~utils/price';

import connectAndRun from '../connectAndRun';

const transformNewOrder = (
  res: any,
) => ({
  order: {
    ...res,
    status: OrderStatus.pending,
  },
  position: {
    ...res,
    status: OrderStatus.live,
  },
  providerData: res,
});

const newOrder = async (params: {
  config: Config,
  prices?: Record<string, Price>,
  requestOrder: Order,
}) => {
  const { config, prices, requestOrder } = params;
  const {
    providerId, providerType, symbol, direction, volume, orderType,
    limitPrice, stopPrice,
    stopLoss, takeProfit,
    comment: commentRaw,
    userName,
  } = requestOrder;
  if (!providerId || !symbol || !direction || !volume || !orderType) {
    throw new Error(`Invalid order: ${JSON.stringify(requestOrder)}`);
  }

  const { symbolNames } = prices
    ? parseSymbols(Object.values(prices))
    : (await getSymbols(providerType));

  const comment = commentRaw || random();
  const orderToNew = {
    symbol,
    symbolId: symbol,
    volume,
    lot: getLotFromVolume({
      providerType,
      prices: prices || symbolNames || {},
      symbol,
      volume,
    })?.lot || 0,
    ...(stopLoss && { stopLoss }),
    ...(takeProfit && { takeProfit }),
    comment,
  };

  const createMarketOrder = async (connection: ConnectionType) => {
    const res = await newOrderMetaTrader(
      connection,
      {
        ...orderToNew,
        symbol: buildSymbol(symbol),
        actionType: direction === Direction.buy
          ? ActionType.ORDER_TYPE_BUY : ActionType.ORDER_TYPE_SELL,
      },
    );

    const { positionId } = res;
    if (!positionId) {
      Logger.error(`[${providerId}] Failed to create order`, res);
      throw new Error(`Failed to create order: [${res.stringCode}] ${res.message}`);
    }

    return {
      ..._.omit(requestOrder, ['providerData', 'updatedLogs']),
      ...orderToNew,
      ...res,
    };
  };

  const createLimitOrder = async (connection: ConnectionType) => {
    if (!limitPrice) {
      throw new Error('LimitPrice is required');
    }

    const res = await newOrderMetaTrader(
      connection,
      {
        ...orderToNew,
        symbol: buildSymbol(symbol),
        actionType: direction === Direction.buy
          ? ActionType.ORDER_TYPE_BUY_LIMIT : ActionType.ORDER_TYPE_SELL_LIMIT,
        openPrice: limitPrice,
      },
    );

    const { orderId } = res;
    if (!orderId) {
      Logger.error(`[${providerId}] Failed to create order`, res);
      throw new Error(`Failed to create order: [${res.stringCode}] ${res.message}`);
    }

    return {
      ..._.omit(requestOrder, ['providerData', 'updatedLogs']),
      ...orderToNew,
      ...res,
    };
  };

  const createStopOrder = async (connection: ConnectionType) => {
    if (!stopPrice) {
      throw new Error('StopPrice is required');
    }

    const res = await newOrderMetaTrader(
      connection,
      {
        ...orderToNew,
        symbol: buildSymbol(symbol),
        actionType: direction === Direction.buy
          ? ActionType.ORDER_TYPE_BUY_STOP : ActionType.ORDER_TYPE_SELL_STOP,
        openPrice: stopPrice,
      },
    );

    const { orderId } = res;
    if (!orderId) {
      Logger.error(`[${providerId}] Failed to create order`, res);
      throw new Error(`Failed to create order: [${res.stringCode}] ${res.message}`);
    }

    return {
      ..._.omit(requestOrder, ['providerData', 'updatedLogs']),
      ...orderToNew,
      ...res,
    };
  };

  /*
  {
    _id: 'metatrader-meta-3f837c583d',
    providerType: 'metatrader',
    providerId: 'meta',
    status: 'idea',
    symbol: 'ETHUSD',
    direction: 'buy',
    volume: 0.1,
    lot: 0.1,
    orderType: 'market',
    userName: 'test',
    stopLoss: undefined,
    takeProfit: undefined,
    comment: 'a413e0cabd',
    numericCode: 0,
    stringCode: 'ERR_NO_ERROR',
    message: 'No error returned',
    orderId: '264986722',
    positionId: '264986722',
    tradeExecutionTime: '2023-04-16T01:58:42.500Z',
    tradeStartTime: '2023-04-16T01:58:42.606Z'
  }
  {
    _id: 'metatrader-meta-3713c049f4',
    providerType: 'metatrader',
    providerId: 'meta',
    status: 'idea',
    symbol: 'ETHUSD',
    direction: 'buy',
    volume: 0.1,
    lot: 0.1,
    orderType: 'limit',
    limitPrice: 10,
    stopLoss: 5,
    takeProfit: 20,
    userName: 'test',
    comment: '0e4e1e9ede',
    numericCode: 0,
    stringCode: 'ERR_NO_ERROR',
    message: 'No error returned',
    orderId: '264986959',
    tradeExecutionTime: '2023-04-16T02:15:57.500Z',
    tradeStartTime: '2023-04-16T02:15:57.139Z'
  }
  */
  const result = await connectAndRun({
    providerId,
    handler: async (conn) => {
      let res;
      switch (orderType) {
        case OrderType.market: {
          res = await createMarketOrder(conn);
          break;
        }
        case OrderType.limit: {
          res = await createLimitOrder(conn);
          break;
        }
        case OrderType.stop: {
          res = await createStopOrder(conn);
          break;
        }
        default: {
          throw new Error(`Unhandled orderType: ${orderType}`);
        }
      }
      return res;
    },
    config: config as ConfigMetaTrader,
  });

  const transformedResult = transformNewOrder(result);

  const { order, position } = transformedResult;
  const isMarket = orderType === OrderType.market;
  const volumeRes = isMarket ? position.volume : order.volume;
  const price = isMarket ? position.price : order.limitPrice || order.stopPrice;
  const stopLossRes = isMarket ? position.stopLoss : order.stopLoss;
  const takeProfitRes = isMarket ? position.takeProfit : order.takeProfit;
  const msg = `Created order ${position.positionId} ${position.direction} ${volumeRes} ${position.symbol} at ${price} SL ${stopLossRes} TP ${takeProfitRes} by ${userName}`;
  Logger.debug(`[${providerId}]`, msg);
  Logger.debug('order', JSON.stringify(order));
  Logger.debug('position', JSON.stringify(position));
  send(msg, [], `p-${providerId}`);

  return transformedResult;
};

export default newOrder;
