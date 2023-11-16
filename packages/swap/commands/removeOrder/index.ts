import { AccountPlatform } from '@fishprovider/utils/dist/constants/account';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';
import type { Config } from '@fishprovider/utils/dist/types/Account.model';
import type { Order, OrderWithoutId } from '@fishprovider/utils/dist/types/Order.model';
import type { Price } from '@fishprovider/utils/dist/types/Price.model';
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

const removeOrder = async (req: RemoveOrderReq) => {
  const { order, options } = req;
  const { accountPlatform } = order;

  const requestOrder = await preCommandOrder(order);

  let res: RemoveOrderRes;
  switch (accountPlatform) {
    case AccountPlatform.ctrader: {
      res = await removeOrderCTrader({ ...req, ...options, requestOrder });
      break;
    }
    case AccountPlatform.metatrader: {
      res = await removeOrderMetaTrader({ ...req, ...options, requestOrder });
      break;
    }
    default: {
      throw new Error(`Unhandled accountPlatform ${accountPlatform}`);
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
