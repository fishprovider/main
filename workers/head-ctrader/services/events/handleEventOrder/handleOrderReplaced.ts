import type { CallbackPayload } from '@fishprovider/ctrader/dist/types/Event.model';
import { transformOrder } from '@fishprovider/swap/dist/libs/ctrader/transform';
import { newRequestOrder } from '@fishprovider/swap/dist/utils/command';
import type { RedisSymbol } from '@fishprovider/utils/dist/types/Redis.model';

import type { ClientAccount } from '~types/Client.model';
import { checkRequestOrder, updateRequestOrder } from '~utils/order';

// when
// 1. new limit order => update => close: Accepted => Replaced => Cancelled
//   + found => update order
//   + not found => new from order

const handleOrderReplaced = async (
  payload: CallbackPayload,
  account: ClientAccount,
  symbolIds: Record<string, RedisSymbol>,
): Promise<number> => {
  const { order, position } = payload;
  const { _id: providerId, providerType } = account;
  Logger.debug('[handleOrderReplaced] payload', providerId, payload);

  const {
    requestOrder, orderId, positionId, label, comment,
  } = await checkRequestOrder(providerId, order, position);

  if (requestOrder) {
    Logger.debug('[handleOrderReplaced] requestOrder found', orderId, positionId);
    const orderToUpdate = transformOrder(
      order,
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
        tag: 'replace-update',
      },
      payload,
    );
    return 1;
  }

  if (!providerId) {
    Logger.error('[handleOrderReplaced] providerId not found', providerId);
    return 2;
  }

  Logger.warn('[handleOrderReplaced] new requestOrder', providerId);
  const orderToNew = transformOrder(
    order,
    providerId,
    providerType,
    symbolIds,
  );
  await newRequestOrder(
    {
      ...orderToNew,

      orderId,
      positionId,
      comment,
      label,

      sourceType: 'event',
      tag: 'replace-create',
    },
    payload,
  );
  return -1;
};

export default handleOrderReplaced;
