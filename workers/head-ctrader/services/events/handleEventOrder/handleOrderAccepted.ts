import { OrderType } from '@fishbot/ctrader/constants/openApi';
import type { CallbackPayload } from '@fishbot/ctrader/types/Event.model';
import { transformOrder, transformPosition } from '@fishbot/swap/libs/ctrader/transform';
import { newRequestOrder } from '@fishbot/swap/utils/command';
import type { OrderWithoutId } from '@fishbot/utils/types/Order.model';
import type { RedisSymbol } from '@fishbot/utils/types/Redis.model';

import type { ClientAccount } from '~types/Client.model';
import { checkRequestOrder, updateRequestOrder } from '~utils/order';

// when
// 1. new limit order => close: Accepted => Cancelled
//   + found => skip (no need to update limit order)
//   + not found => new from order

// 2. new market order => close: Accepted (new) => Filled
//     => Accepted (close, opposite order with volume) => Filled
//   + found => skip (update on Filled)
//   + not found Accepted (new) => new from order
//   + not found Accepted (close) => new from position

// 3. new market order => update => close: Accepted (new) => Filled
//     => Accepted (update, opposite order with limit=TP, stop=SL)
//     => Accepted (close, opposite order with volume) => Filled
//     => Cancelled (new, opposite order with limit=TP, stop=SL)
//   + found Accepted (new/close) => skip (update on Filled)
//   + found Accepted (update) => update order
//   + not found Accepted (new) => new from order
//   + not found Accepted (update) => new from position
//   + not found Accepted (close) => new from position

const handleOrderAccepted = async (
  payload: CallbackPayload,
  account: ClientAccount,
  symbolIds: Record<string, RedisSymbol>,
): Promise<number> => {
  const { order, position } = payload;
  const { _id: providerId, providerType } = account;
  Logger.debug('[handleOrderAccepted] payload', providerId, payload);

  const {
    requestOrder, orderId, positionId, label, comment,
  } = await checkRequestOrder(providerId, order, position);

  if (requestOrder) {
    Logger.debug('[handleOrderAccepted] requestOrder found', orderId, positionId);
    if (order.orderType === OrderType.STOP_LOSS_TAKE_PROFIT) {
      const orderToUpdate = transformPosition(
        { ...order, ...position },
        providerId,
        providerType,
        symbolIds,
      );
      await updateRequestOrder(
        requestOrder,
        {
          ...orderToUpdate,

          _id: requestOrder._id,
          orderId,
          positionId,
          comment,
          label,

          sourceType: 'event',
          tag: 'accepted-update',
        },
        payload,
      );
    }
    return 1;
  }

  if (!providerId) {
    Logger.error('[handleOrderAccepted] providerId not found', providerId);
    return 2;
  }

  Logger.warn('[handleOrderAccepted] new requestOrder', providerId);
  let orderToNew: OrderWithoutId;
  switch (order.orderType) {
    case OrderType.LIMIT:
    case OrderType.STOP:
      orderToNew = transformOrder(
        order,
        providerId,
        providerType,
        symbolIds,
      );
      break;
    case OrderType.STOP_LOSS_TAKE_PROFIT:
      orderToNew = transformPosition(
        { ...order, ...position },
        providerId,
        providerType,
        symbolIds,
      );
      break;
    case OrderType.MARKET:
      if (order.tradeSide === position.tradeSide) {
        orderToNew = transformOrder(
          order,
          providerId,
          providerType,
          symbolIds,
        );
      } else {
        orderToNew = transformPosition(
          { ...order, ...position },
          providerId,
          providerType,
          symbolIds,
        );
      }
      break;
    default:
      Logger.error(`[handleOrderAccepted] Unhandled otherType ${order.orderType}`);
      return 3;
  }
  await newRequestOrder(
    {
      ...orderToNew,

      orderId,
      positionId,
      comment,
      label,

      sourceType: 'event',
      tag: 'accepted-create',
    },
    payload,
  );
  return -1;
};

export default handleOrderAccepted;
