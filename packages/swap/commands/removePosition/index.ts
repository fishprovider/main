import { AccountPlatform } from '@fishprovider/utils/dist/constants/account';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';
import type { Config } from '@fishprovider/utils/dist/types/Account.model';
import type { Order, OrderWithoutId } from '@fishprovider/utils/dist/types/Order.model';
import type { Price } from '@fishprovider/utils/dist/types/Price.model';
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

  Mongo.collection<Order>('orders').updateOne( // non-blocking
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
  const { platform } = order;

  const requestOrder = await preCommandOrder(order);

  let res: RemovePositionRes;
  switch (platform) {
    case AccountPlatform.ctrader: {
      res = await removePositionCTrader({ ...req, ...options, requestOrder });
      break;
    }
    case AccountPlatform.metatrader: {
      res = await removePositionMetaTrader({ ...req, ...options, requestOrder });
      break;
    }
    default: {
      throw new Error(`Unhandled platform ${platform}`);
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
