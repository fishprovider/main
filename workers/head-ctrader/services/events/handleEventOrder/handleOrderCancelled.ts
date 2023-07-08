import type { CallbackPayload } from '@fishprovider/ctrader/types/Event.model';
import { transformOrder, transformPosition } from '@fishprovider/swap/libs/ctrader/transform';
import { newRequestOrder } from '@fishprovider/swap/utils/command';
import { OrderStatus } from '@fishprovider/utils/constants/order';
import type { OrderWithoutId } from '@fishprovider/utils/types/Order.model';
import type { RedisSymbol } from '@fishprovider/utils/types/Redis.model';

import type { ClientAccount } from '~types/Client.model';
import { checkRequestOrder, updateRequestOrder } from '~utils/order';

// when
// 1. new limit order => close: Accepted => Cancelled
//   + found => update order
//   + not found => new from order

// 2. new market order => update => close: Accepted (new) => Filled
//     => Accepted (update, opposite order with limit=TP, stop=SL)
//     => Accepted (close, opposite order with volume) => Filled
//     => Cancelled (new, opposite order with limit=TP, stop=SL)
//   + found => update order
//   + not found => new from order

const handleOrderCancelled = async (
  payload: CallbackPayload,
  account: ClientAccount,
  symbolIds: Record<string, RedisSymbol>,
): Promise<number> => {
  const { order, position } = payload;
  const { _id: providerId, providerType } = account;
  Logger.debug('[handleOrderCancelled] payload', providerId, payload);

  const {
    requestOrder, orderId, positionId, label, comment,
  } = await checkRequestOrder(providerId, order, position);

  if (requestOrder) {
    Logger.debug('[handleOrderCancelled] requestOrder found', orderId, positionId);
    let orderToUpdate: OrderWithoutId;
    if (order.tradeSide === position.tradeSide) {
      orderToUpdate = transformOrder(
        order,
        providerId,
        providerType,
        symbolIds,
      );
    } else {
      orderToUpdate = transformPosition(
        { ...order, ...position },
        providerId,
        providerType,
        symbolIds,
      );
    }
    await updateRequestOrder(
      requestOrder,
      {
        ...orderToUpdate,
        status: OrderStatus.closed,

        _id: requestOrder._id,
        orderId,
        positionId,
        comment,
        label,

        sourceType: 'event',
        tag: 'cancelled-update',
      },
      payload,
    );
    return 1;
  }

  if (!providerId) {
    Logger.error('[handleOrderCancelled] providerId not found', providerId);
    return 2;
  }

  Logger.warn('[handleOrderCancelled] new requestOrder', providerId);
  let orderToNew: OrderWithoutId;
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
  await newRequestOrder(
    {
      ...orderToNew,
      status: OrderStatus.closed,

      orderId,
      positionId,
      comment,
      label,

      sourceType: 'event',
      tag: 'cancelled-create',
    },
    payload,
  );
  return -1;
};

export default handleOrderCancelled;
