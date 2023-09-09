import closePosition from '@fishprovider/ctrader/dist/commands/closePosition';
import {
  CallbackType, ExecutionType, OrderStatus as OrderStatusCTrader, PositionStatus,
} from '@fishprovider/ctrader/dist/constants/openApi';
import type { Config as ConfigCTrader } from '@fishprovider/ctrader/dist/types/Config.model';
import type { CallbackPayload } from '@fishprovider/ctrader/dist/types/Event.model';
import type { transformDeal as transformDealCTrader, transformOrder as transformOrderCTrader, transformPosition as transformPositionCTrader } from '@fishprovider/ctrader/dist/utils/transform';
import { send } from '@fishprovider/old-core/dist/libs/notif';
import type { ProviderType } from '@fishprovider/utils/dist/constants/account';
import promiseCreator from '@fishprovider/utils/dist/helpers/promiseCreator';
import type { Config } from '@fishprovider/utils/dist/types/Account.model';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import type { Price } from '@fishprovider/utils/dist/types/Price.model';
import type { RedisSymbol } from '@fishprovider/utils/dist/types/Redis.model';
import type { AsyncReturnType } from 'type-fest';

import { getSymbols, parseSymbols } from '~utils/price';

import connectAndRun from '../connectAndRun';
import { transformDeal, transformOrder, transformPosition } from '../transform';

const transformRemovePosition = (
  res: AsyncReturnType<typeof closePosition>,
  providerId: string,
  providerType: ProviderType,
  symbolIds: Record<string, RedisSymbol>,
) => {
  const { order, position, deal } = res;
  if (!order || !position || !deal) {
    throw new Error('Failed to remove position');
  }
  return {
    order: transformOrder(order, providerId, providerType, symbolIds),
    position: transformPosition({ ...order, ...position }, providerId, providerType, symbolIds),
    deal: transformDeal(deal, providerId, providerType, symbolIds),
    providerData: res,
  };
};

const removePosition = async (params: {
  config: Config,
  prices?: Record<string, Price>,
  requestOrder: Order,
  volume?: number,
}) => {
  const {
    config, prices, requestOrder,
    volume = requestOrder.volume,
  } = params;
  const {
    providerId, providerType, positionId, userName,
  } = requestOrder;
  if (!positionId) {
    throw new Error('Missing positionId');
  }

  const promisePosition = promiseCreator();

  const result = await connectAndRun({
    providerId,
    handler: async (conn) => {
      const res = await closePosition(conn, positionId, volume);
      const { order, position } = res;
      if (!order
        || order.orderStatus !== OrderStatusCTrader.ORDER_STATUS_ACCEPTED
        || !position
        || position.positionStatus !== PositionStatus.POSITION_STATUS_OPEN
      ) {
        Logger.error(`[${providerId}] Failed to remove position`, res);
        throw new Error('Failed to remove position');
      }

      const resEvent = await promisePosition as {
        order: ReturnType<typeof transformOrderCTrader>;
        position: ReturnType<typeof transformPositionCTrader>;
        deal: ReturnType<typeof transformDealCTrader>;
      };
      const { order: orderEvent, position: positionEvent } = resEvent;
      if (!orderEvent
        || orderEvent.orderStatus !== OrderStatusCTrader.ORDER_STATUS_FILLED
        || !positionEvent
        || (positionEvent.volume
          && position.positionStatus !== PositionStatus.POSITION_STATUS_OPEN)
        || (!positionEvent.volume
          && positionEvent.positionStatus !== PositionStatus.POSITION_STATUS_CLOSED
          && positionEvent.positionStatus !== PositionStatus.POSITION_STATUS_CREATED
        )
      ) {
        Logger.error(`[${providerId}] Failed to remove position (after event)`, resEvent);
        throw new Error('Failed to remove position (after event)');
      }

      return {
        ...res,
        ...resEvent,
        order: res.order, // volume to close
        position: resEvent.position, // remaining volume
        deal: resEvent.deal, // closed volume with profit
      };
    },
    onEvent: (payload: CallbackPayload) => {
      const { type, executionType, position } = payload;
      if (type === CallbackType.order
        && executionType === ExecutionType.ORDER_FILLED
        && position.positionId === positionId
      ) {
        promisePosition.resolveExec(payload);
      }
    },
    config: config as ConfigCTrader,
  });

  const { symbolIds } = prices
    ? parseSymbols(Object.values(prices))
    : (await getSymbols(providerType));

  const transformedResult = transformRemovePosition(result, providerId, providerType, symbolIds);

  const { order, position, deal } = transformedResult;
  const {
    direction, volume: volumeClose, symbol, price,
  } = deal;
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
