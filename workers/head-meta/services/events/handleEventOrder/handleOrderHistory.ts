import { ActionType, OrderState } from '@fishprovider/metatrader/constants/metaApi';
import type { CallbackPayload } from '@fishprovider/metatrader/types/Event.model';
import { transformOrder } from '@fishprovider/swap/libs/metatrader/transform';
import { newRequestOrder } from '@fishprovider/swap/utils/command';
import type { OrderWithoutId } from '@fishprovider/utils/types/Order.model';
import type { RedisSymbol } from '@fishprovider/utils/types/Redis.model';
import moment from 'moment';

import type { ClientAccount } from '~types/Client.model';
import { checkRequestOrder, updateRequestOrder } from '~utils/order';

/*
{
  type: 'history',
  accountId: 'bbbb4df6-b4cd-4286-9c5f-4eadd0cc94f6',
  order: {
    id: '266667398',
    platform: 'mt4',
    type: 'ORDER_TYPE_BUY',
    state: 'ORDER_STATE_FILLED',
    symbol: 'XAGUSD',
    magic: 0,
    time: 2023-04-20T05:12:25.000Z,
    brokerTime: '2023-04-20 05:12:25.000',
    openPrice: 25.087,
    volume: 0.01,
    currentVolume: 0,
    positionId: '266667398',
    reason: 'ORDER_REASON_UNKNOWN',
    fillingMode: 'ORDER_FILLING_FOK',
    expirationType: 'ORDER_TIME_SPECIFIED',
    doneTime: 2023-04-20T05:12:25.000Z,
    doneBrokerTime: '2023-04-20 05:12:25.000',
    accountCurrencyExchangeRate: 1,
    brokerComment: 'copy-329808940',
    comment: 'copy-329808940',
    updateSequenceNumber: 1681986949000049
  }
}
*/

const handleOrderHistory = async (
  payload: CallbackPayload,
  account: ClientAccount,
  symbolIds: Record<string, RedisSymbol>,
): Promise<number> => {
  const { order } = payload;

  if (order.time && moment().diff(moment(order.time), 'hours') > 24) {
    Logger.debug('[handleOrderHistory] Skipped old history', order.time);
    return 4;
  }

  const { _id: providerId } = account;
  Logger.debug('[handleOrderHistory] payload', providerId, payload);

  const { providerType } = account;

  if ([
    OrderState.ORDER_STATE_FILLED,
  ].includes(order.state)) {
    Logger.debug('[handleOrderDeal] Unhandled entryType', order.state);
    return 2;
  }

  const actionType = order?.type;
  let orderToUpdate: OrderWithoutId;
  switch (actionType) {
    case ActionType.ORDER_TYPE_BUY:
    case ActionType.ORDER_TYPE_SELL:
      orderToUpdate = transformOrder(order, providerId, providerType, symbolIds);
      break;
    default:
      Logger.error(`[handleOrderHistory] Unhandled otherType ${actionType}`);
      return 3;
  }

  const {
    requestOrder, orderId, positionId, comment,
  } = await checkRequestOrder(providerId, orderToUpdate);

  if (requestOrder) {
    Logger.debug('[handleOrderHistory] requestOrder found', orderId, positionId);
    await updateRequestOrder(
      requestOrder,
      {
        ...orderToUpdate,

        _id: requestOrder._id,
        orderId,
        positionId,
        comment,

        sourceType: 'event',
        tag: 'cancelled-update',
      },
      payload,
    );
    return 1;
  }

  if (!providerId) {
    Logger.error('[handleOrderHistory] providerId not found', providerId);
    return 2;
  }

  Logger.warn('[handleOrderHistory] new requestOrder', providerId);
  await newRequestOrder(
    {
      ...orderToUpdate,

      orderId,
      positionId,
      comment,

      sourceType: 'event',
      tag: 'cancelled-create',
    },
    payload,
  );
  return -1;
};

export default handleOrderHistory;
