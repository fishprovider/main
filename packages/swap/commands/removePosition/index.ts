import { ProviderPlatform } from '@fishbot/utils/constants/account';
import { OrderStatus } from '@fishbot/utils/constants/order';
import type { Config } from '@fishbot/utils/types/Account.model';
import type { Order, OrderWithoutId } from '@fishbot/utils/types/Order.model';
import type { Price } from '@fishbot/utils/types/Price.model';
import _ from 'lodash';

import removePositionCTrader from '~libs/ctrader/commands/removePosition';
import removePositionMetaTrader from '~libs/metatrader/commands/removePosition';
import { preCommandOrder } from '~utils/command';

interface RemovePositionReqOptions {
  config: Config,
  prices?: Record<string, Price>,
}

interface RemovePositionReq {
  order: Order,
  options: RemovePositionReqOptions,
}

interface RemovePositionRes {
  order: OrderWithoutId,
  position: OrderWithoutId,
  deal: OrderWithoutId,
  providerData: Record<string, any>;
}

const postRemovePosition = async (
  requestOrder: Order,
  options?: Record<string, any>,
  res?: RemovePositionRes,
) => {
  const {
    order, position, deal, providerData,
  } = res || {};

  const updateDoc = {
    ...order,
    ...position,
    ...deal,
    ..._.omit(options, ['config']),
    status: OrderStatus.closed,
    direction: position?.direction,
    ..._.omit(providerData, ['symbolIds', 'prices']),
    sourceType: 'user',
    tag: 'removePosition',
    updatedAt: new Date(),
  };

  // non-blocking
  Mongo.collection<Order>('orders').updateOne(
    { _id: requestOrder._id },
    {
      $set: updateDoc,
      $push: {
        updatedLogs: updateDoc,
      },
    },
  );

  return updateDoc;
};

const removePosition = async (req: RemovePositionReq) => {
  const { order, options } = req;
  const { providerPlatform } = order;

  const requestOrder = await preCommandOrder(order);

  let res: RemovePositionRes;
  switch (providerPlatform) {
    case ProviderPlatform.ctrader: {
      res = await removePositionCTrader({ ...req, ...options, requestOrder });
      break;
    }
    case ProviderPlatform.metatrader: {
      res = await removePositionMetaTrader({ ...req, ...options, requestOrder });
      break;
    }
    default: {
      throw new Error(`Unhandled providerPlatform ${providerPlatform}`);
    }
  }

  const updateOrder = await postRemovePosition(requestOrder, options, res);

  return {
    ...requestOrder,
    ...updateOrder,
  };
};

export default removePosition;

export type { RemovePositionRes };
