import { push, send } from '@fishprovider/core/dist/libs/notif';
import newOrderCTrader from '@fishprovider/ctrader/dist/commands/newOrder';
import updatePosition from '@fishprovider/ctrader/dist/commands/updatePosition';
import {
  CallbackType, ExecutionType, OrderStatus as OrderStatusCTrader, OrderType as OrderTypeCTrader,
  PositionStatus, TradeSide,
} from '@fishprovider/ctrader/dist/constants/openApi';
import type { Config as ConfigCTrader } from '@fishprovider/ctrader/dist/types/Config.model';
import type { ConnectionType } from '@fishprovider/ctrader/dist/types/Connection.model';
import type { CallbackPayload } from '@fishprovider/ctrader/dist/types/Event.model';
import type { transformOrder as transformOrderCTrader, transformPosition as transformPositionCTrader } from '@fishprovider/ctrader/dist/utils/transform';
import type { ProviderType } from '@fishprovider/utils/dist/constants/account';
import { Direction, OrderType } from '@fishprovider/utils/dist/constants/order';
import promiseCreator from '@fishprovider/utils/dist/helpers/promiseCreator';
import random from '@fishprovider/utils/dist/helpers/random';
import type { Config } from '@fishprovider/utils/dist/types/Account.model';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import type { Price } from '@fishprovider/utils/dist/types/Price.model';
import type { RedisSymbol } from '@fishprovider/utils/dist/types/Redis.model';
import type { AsyncReturnType } from 'type-fest';

import { getSymbols, parseSymbols } from '~utils/price';

import connectAndRun from '../connectAndRun';
import { transformOrder, transformPosition } from '../transform';

const transformNewOrder = (
  res: AsyncReturnType<typeof newOrderCTrader>,
  providerId: string,
  providerType: ProviderType,
  symbolIds: Record<string, RedisSymbol>,
) => {
  const { order, position } = res;
  if (!order || !position) {
    throw new Error('Failed to create order');
  }
  return {
    order: transformOrder(order, providerId, providerType, symbolIds),
    position: transformPosition({ ...order, ...position }, providerId, providerType, symbolIds),
    providerData: res,
  };
};

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
    label,
    userName,
  } = requestOrder;
  if (!providerId || !symbol || !direction || !volume || !orderType) {
    throw new Error(`Invalid order: ${JSON.stringify(requestOrder)}`);
  }

  const { symbolIds, symbolNames } = prices
    ? parseSymbols(Object.values(prices))
    : (await getSymbols(providerType));

  const symbolId = symbolNames[symbol]?.symbolId;
  if (!symbolId) {
    throw new Error(`Unknown symbol: ${symbol}`);
  }

  const comment = commentRaw || random();

  const promisePosition = promiseCreator();

  const createMarketOrder = async (connection: ConnectionType) => {
    const res = await newOrderCTrader(
      connection,
      symbolId,
      OrderTypeCTrader.MARKET,
      direction === Direction.buy ? TradeSide.BUY : TradeSide.SELL,
      volume,
      {
        comment,
        label,
      },
    );

    const { order, position } = res;
    if (!order
      || order.orderStatus !== OrderStatusCTrader.ORDER_STATUS_ACCEPTED
      || !position
      || position.positionStatus !== PositionStatus.POSITION_STATUS_CREATED
    ) {
      Logger.error(`[${providerId}] Failed to create order`, res);
      throw new Error('Failed to create order');
    }

    const resEvent = await promisePosition;
    const { order: orderEvent, position: positionEvent } = resEvent as {
      order: ReturnType<typeof transformOrderCTrader>;
      position: ReturnType<typeof transformPositionCTrader>;
    };
    if (!orderEvent
      || orderEvent.orderStatus !== OrderStatusCTrader.ORDER_STATUS_FILLED
      || !positionEvent
      || positionEvent.positionStatus !== PositionStatus.POSITION_STATUS_OPEN
    ) {
      Logger.error(`[${providerId}] Failed to fill created order`, resEvent);
      throw new Error('Failed to fill created order');
    }

    if (stopLoss || takeProfit) {
      const resWithSLTP = await updatePosition(connection, position.positionId, {
        ...(stopLoss && { stopLoss }),
        ...(takeProfit && { takeProfit }),
      });
      return {
        ...res,
        order: {
          ...order,
          ...orderEvent,
        },
        position: {
          ...position,
          ...positionEvent,
          ...resWithSLTP.position,
        },
      };
    }

    return {
      ...res,
      order: {
        ...order,
        ...orderEvent,
      },
      position: {
        ...position,
        ...positionEvent,
      },
    };
  };

  const createLimitOrder = async (connection: ConnectionType) => {
    if (!limitPrice) {
      throw new Error('LimitPrice is required');
    }

    const res = await newOrderCTrader(
      connection,
      symbolId,
      OrderTypeCTrader.LIMIT,
      direction === Direction.buy ? TradeSide.BUY : TradeSide.SELL,
      volume,
      {
        limitPrice,
        ...(stopLoss && { stopLoss }),
        ...(takeProfit && { takeProfit }),
        comment,
        label,
      },
    );
    const { order, position } = res;
    if (!order
      || order.orderStatus !== OrderStatusCTrader.ORDER_STATUS_ACCEPTED
      || !position
      || position.positionStatus !== PositionStatus.POSITION_STATUS_CREATED
    ) {
      Logger.error(`[${providerId}] Failed to create order`, res);
      throw new Error('Failed to create order');
    }
    return res;
  };

  const createStopOrder = async (connection: ConnectionType) => {
    if (!stopPrice) {
      throw new Error('StopPrice is required');
    }

    const res = await newOrderCTrader(
      connection,
      symbolId,
      OrderTypeCTrader.STOP,
      direction === Direction.buy ? TradeSide.BUY : TradeSide.SELL,
      volume,
      {
        stopPrice,
        ...(stopLoss && { stopLoss }),
        ...(takeProfit && { takeProfit }),
        comment,
        label,
      },
    );
    const { order, position } = res;
    if (!order
      || order.orderStatus !== OrderStatusCTrader.ORDER_STATUS_ACCEPTED
      || !position
      || position.positionStatus !== PositionStatus.POSITION_STATUS_CREATED
    ) {
      Logger.error(`[${providerId}] Failed to create order`, res);
      throw new Error('Failed to create order');
    }
    return res;
  };

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
    config: config as ConfigCTrader,
    onEvent: (payload: CallbackPayload) => {
      const { type, executionType, position } = payload;
      if (type === CallbackType.order
        && executionType === ExecutionType.ORDER_FILLED
        && position.comment === comment
      ) {
        promisePosition.resolveExec(payload);
      }
    },
  });

  const transformedResult = transformNewOrder(result, providerId, providerType, symbolIds);

  const { order, position } = transformedResult;
  const isMarket = orderType === OrderType.market;
  const volumeRes = isMarket ? position.volume : order.volume;
  const price = isMarket ? position.price : order.limitPrice || order.stopPrice;
  const stopLossRes = isMarket ? position.stopLoss : order.stopLoss;
  const takeProfitRes = isMarket ? position.takeProfit : order.takeProfit;
  const msg = `[${position.positionId}] ${position.direction} ${volumeRes} ${position.symbol} at ${price} SL ${stopLossRes} TP ${takeProfitRes} by ${userName}`;
  Logger.debug(`[${providerId}]`, msg);
  Logger.debug('order', JSON.stringify(order));
  Logger.debug('position', JSON.stringify(position));
  send(msg, [], `p-${providerId}`);
  push(
    { title: `[${providerId}] New order`, body: msg },
    `account-${providerId}`,
  );

  return transformedResult;
};

export default newOrder;
