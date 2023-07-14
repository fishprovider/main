import { push } from '@fishprovider/core/dist/libs/firebase';
import { TradeSide } from '@fishprovider/ctrader/dist/constants/openApi';
import type { CallbackPayload } from '@fishprovider/ctrader/dist/types/Event.model';
import { transformDeal, transformPosition } from '@fishprovider/swap/dist/libs/ctrader/transform';
import { newRequestOrder } from '@fishprovider/swap/dist/utils/command';
import { Direction, OrderStatus } from '@fishprovider/utils/dist/constants/order';
import type { OrderWithoutId } from '@fishprovider/utils/dist/types/Order.model';
import type { RedisSymbol } from '@fishprovider/utils/dist/types/Redis.model';

import type { ClientAccount } from '~types/Client.model';
import { checkRequestOrder, updateRequestOrder } from '~utils/order';

// when
// 1. new limit order => fill => close: Accepted => Filled => Cancelled
//   + found => update position
//   + not found => new from position

// 2. new market order => close: Accepted (new) => Filled
//     => Accepted (close, opposite order with volume) => Filled
//   + found Filled (new) => update position
//   + found Filled (close) => update deal
//   + not found Filled (new) => new from position
//   + not found Filled (close) => new from deal

const handleOrderFilled = async (
  payload: CallbackPayload,
  account: ClientAccount,
  symbolIds: Record<string, RedisSymbol>,
): Promise<number> => {
  const { order, position, deal } = payload;
  const { _id: providerId, providerType } = account;
  Logger.debug('[handleOrderFilled] payload', providerId, payload);

  const isClosed = order.tradeSide !== position.tradeSide;

  const {
    requestOrder, orderId, positionId, label, comment,
  } = await checkRequestOrder(providerId, order, position);

  if (requestOrder) {
    Logger.debug('[handleOrderFilled] requestOrder found', orderId, positionId);
    let orderToUpdate: OrderWithoutId;
    if (isClosed) {
      const direction = position.tradeSide === TradeSide.BUY ? Direction.buy : Direction.sell;
      orderToUpdate = {
        ...transformDeal(
          { ...order, ...position, ...deal },
          providerId,
          providerType,
          symbolIds,
        ),
        direction,
        status: OrderStatus.closed,
      };
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

        _id: requestOrder._id,
        orderId,
        positionId,
        comment,
        label,

        sourceType: 'event',
        tag: 'filled-update',
      },
      payload,
    );

    push(
      {
        title: `[${providerId}] ${isClosed ? 'Closed' : 'Filled'} order`,
        body: `[${positionId}] ${orderToUpdate.direction} ${orderToUpdate.volume} ${orderToUpdate.symbol}`,
      },
      providerId,
    );

    return 1;
  }

  if (!providerId) {
    Logger.error('[handleOrderFilled] providerId not found', providerId);
    return 2;
  }

  Logger.warn('[handleOrderFilled] new requestOrder', providerId);
  let orderToNew: OrderWithoutId;
  if (isClosed) {
    const direction = position.tradeSide === TradeSide.BUY ? Direction.buy : Direction.sell;
    orderToNew = {
      ...transformDeal(
        { ...order, ...position, ...deal },
        providerId,
        providerType,
        symbolIds,
      ),
      direction,
      status: OrderStatus.closed,
    };
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

      orderId,
      positionId,
      comment,
      label,

      sourceType: 'event',
      tag: 'filled-create',
    },
    payload,
  );

  push(
    {
      title: `[${providerId}] ${isClosed ? 'Closed' : 'Filled'} order`,
      body: `[${positionId}] ${orderToNew.direction} ${orderToNew.volume} ${orderToNew.symbol}`,
    },
    providerId,
  );

  return -1;
};

export default handleOrderFilled;
