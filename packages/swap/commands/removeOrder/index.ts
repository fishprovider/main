import { ProviderPlatform } from '@fishbot/utils/constants/account';
import { OrderStatus } from '@fishbot/utils/constants/order';
import type { Config } from '@fishbot/utils/types/Account.model';
import type { Order, OrderWithoutId } from '@fishbot/utils/types/Order.model';
import type { Price } from '@fishbot/utils/types/Price.model';
import _ from 'lodash';

import removeOrderCTrader from '~libs/ctrader/commands/removeOrder';
import removeOrderMetaTrader from '~libs/metatrader/commands/removeOrder';
import { preCommandOrder } from '~utils/command';

interface RemoveOrderReqOptions {
  config: Config,
  prices?: Record<string, Price>,
}

interface RemoveOrderReq {
  order: Order,
  options: RemoveOrderReqOptions,
}

interface RemoveOrderRes {
  order: OrderWithoutId,
  position: OrderWithoutId,
  providerData: Record<string, any>;
}

const postRemoveOrder = async (
  requestOrder: Order,
  options?: Record<string, any>,
  res?: RemoveOrderRes,
) => {
  const { providerData } = res || {};
  const updateDoc = {
    ..._.omit(options, ['config']),
    status: OrderStatus.closed,
    ..._.omit(providerData, ['symbolIds', 'prices']),
    sourceType: 'user',
    tag: 'removeOrder',
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

const removeOrder = async (req: RemoveOrderReq) => {
  const { order, options } = req;
  const { providerPlatform } = order;

  const requestOrder = await preCommandOrder(order);

  let res: RemoveOrderRes;
  switch (providerPlatform) {
    case ProviderPlatform.ctrader: {
      res = await removeOrderCTrader({ ...req, ...options, requestOrder });
      break;
    }
    case ProviderPlatform.metatrader: {
      res = await removeOrderMetaTrader({ ...req, ...options, requestOrder });
      break;
    }
    default: {
      throw new Error(`Unhandled providerPlatform ${providerPlatform}`);
    }
  }

  const updateOrder = await postRemoveOrder(requestOrder, options, res);

  return {
    ...requestOrder,
    ...updateOrder,
  };
};

export default removeOrder;

export type { RemoveOrderRes };
