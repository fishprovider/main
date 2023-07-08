import { ActionType } from '@fishprovider/metatrader/constants/metaApi';
import type { CallbackPayload } from '@fishprovider/metatrader/types/Event.model';
import { transformOrder, transformPosition } from '@fishprovider/swap/libs/metatrader/transform';
import { newRequestOrder } from '@fishprovider/swap/utils/command';
import type { OrderWithoutId } from '@fishprovider/utils/types/Order.model';
import type { RedisSymbol } from '@fishprovider/utils/types/Redis.model';

import type { ClientAccount } from '~types/Client.model';
import { checkRequestOrder, updateRequestOrder } from '~utils/order';

/*
{
  type: 'position',
  accountId: '5b05a086-65e5-4c66-9ab5-586952e3f949',
  position: {
    id: '187604575',
    platform: 'mt4',
    type: 'POSITION_TYPE_BUY',
    symbol: 'AUDUSD',
    magic: 0,
    time: 2022-11-21T02:58:39.000Z,
    brokerTime: '2022-11-21 02:58:39.000',
    updateTime: 2022-11-21T02:58:39.000Z,
    openPrice: 0.66433,
    volume: 0.01,
    swap: 0,
    realizedSwap: 0,
    unrealizedSwap: 0,
    commission: 0,
    realizedCommission: 0,
    unrealizedCommission: 0,
    realizedProfit: 0,
    reason: 'POSITION_REASON_UNKNOWN',
    accountCurrencyExchangeRate: 1,
    stopLoss: 2000,
    takeProfit: 4000,
    unrealizedProfit: -0.12,
    profit: -0.12,
    currentPrice: 0.66424,
    currentTickValue: 1,
    updateSequenceNumber: 1668999519000008
  }
}
{
  type: 'order',
  accountId: 'bbbb4df6-b4cd-4286-9c5f-4eadd0cc94f6',
  order: {
    id: '264497204',
    platform: 'mt4',
    type: 'ORDER_TYPE_BUY_LIMIT',
    state: 'ORDER_STATE_PLACED',
    symbol: 'NZDUSD',
    magic: 0,
    time: 2023-04-14T06:15:20.000Z,
    brokerTime: '2023-04-14 06:15:20.000',
    openPrice: 0.62333,
    volume: 0.01,
    currentVolume: 0.01,
    positionId: '264497204',
    reason: 'ORDER_REASON_UNKNOWN',
    fillingMode: 'ORDER_FILLING_FOK',
    expirationType: 'ORDER_TIME_SPECIFIED',
    currentPrice: 0.63054,
    accountCurrencyExchangeRate: 1,
    stopLoss: 2000,
    takeProfit: 4000,
    updateSequenceNumber: 1681452920000010
  }
}
*/

const handleOrderUpdate = async (
  payload: CallbackPayload,
  account: ClientAccount,
  symbolIds: Record<string, RedisSymbol>,
): Promise<number> => {
  const { order, position } = payload;
  const { _id: providerId, providerType } = account;
  Logger.debug('[handleOrderUpdate] payload', providerId, payload);

  const actionType = order?.type || position?.type;
  let orderToUpdate: OrderWithoutId;
  switch (actionType) {
    case ActionType.ORDER_TYPE_BUY_LIMIT:
    case ActionType.ORDER_TYPE_SELL_LIMIT:
    case ActionType.ORDER_TYPE_BUY_STOP:
    case ActionType.ORDER_TYPE_SELL_STOP:
      orderToUpdate = transformOrder(order, providerId, providerType, symbolIds);
      break;
    case ActionType.POSITION_TYPE_BUY:
    case ActionType.POSITION_TYPE_SELL:
      orderToUpdate = transformPosition(position, providerId, providerType, symbolIds);
      break;
    default:
      Logger.error(`[handleOrderUpdate] Unhandled otherType ${actionType}`);
      return 3;
  }

  const {
    requestOrder, orderId, positionId, comment,
  } = await checkRequestOrder(providerId, orderToUpdate);

  if (requestOrder) {
    Logger.debug('[handleOrderUpdate] requestOrder found', orderId, positionId);
    await updateRequestOrder(
      requestOrder,
      {
        ...orderToUpdate,

        _id: requestOrder._id,
        orderId,
        positionId,
        comment,

        sourceType: 'event',
        tag: 'accepted-update',
      },
      payload,
    );
    return 1;
  }

  if (!providerId) {
    Logger.error('[handleOrderUpdate] providerId not found', providerId);
    return 2;
  }

  Logger.warn('[handleOrderUpdate] new requestOrder', providerId);
  await newRequestOrder(
    {
      ...orderToUpdate,

      orderId,
      positionId,
      comment,

      sourceType: 'event',
      tag: 'accepted-create',
    },
    payload,
  );
  return -1;
};

export default handleOrderUpdate;
