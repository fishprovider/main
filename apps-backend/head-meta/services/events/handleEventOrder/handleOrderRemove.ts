import type { CallbackPayload } from '@fishprovider/metatrader/dist/types/Event.model';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';

import type { ClientAccount } from '~types/Client.model';
import { checkRequestOrder, updateRequestOrder } from '~utils/order';

/*
{
  type: 'removePosition',
  accountId: 'bbbb4df6-b4cd-4286-9c5f-4eadd0cc94f6',
  positionId: '264495914'
}
{
  type: 'completeOrder',
  accountId: 'bbbb4df6-b4cd-4286-9c5f-4eadd0cc94f6',
  orderId: '264497204'
}
*/

const handleOrderRemove = async (
  payload: CallbackPayload,
  account: ClientAccount,
): Promise<number> => {
  const { _id: providerId } = account;
  Logger.debug('[handleOrderRemove] payload', providerId, payload);

  const orderToRemove = {
    providerId,
    orderId: payload.orderId,
    positionId: payload.positionId,
  };
  const {
    requestOrder, orderId, positionId,
  } = await checkRequestOrder(providerId, orderToRemove);

  if (requestOrder) {
    Logger.debug('[handleOrderRemove] requestOrder found', orderId, positionId);
    await updateRequestOrder(
      requestOrder,
      {
        ...requestOrder,
        status: OrderStatus.closed,

        sourceType: 'event',
        tag: 'cancelled-update',
      },
      payload,
    );
    return 1;
  }

  Logger.warn('[handleOrderRemove] requestOrder not found', providerId);
  return -1;
};

export default handleOrderRemove;
