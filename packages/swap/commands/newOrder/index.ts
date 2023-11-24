import { AccountPlatform } from '@fishprovider/utils/dist/constants/account';
import { OrderStatus, OrderType } from '@fishprovider/utils/dist/constants/order';
import random from '@fishprovider/utils/dist/helpers/random';
import type { Config } from '@fishprovider/utils/dist/types/Account.model';
import type { Order, OrderWithoutId } from '@fishprovider/utils/dist/types/Order.model';
import type { Price } from '@fishprovider/utils/dist/types/Price.model';
import _ from 'lodash';

import newOrderCTrader from '~libs/ctrader/commands/newOrder';
import newOrderMetaTrader from '~libs/metatrader/commands/newOrder';

interface NewOrderReqOptions {
  config: Config,
  prices?: Record<string, Price>,
}

interface NewOrderReq {
  order: OrderWithoutId,
  options: NewOrderReqOptions,
}

interface NewOrderRes {
  order: OrderWithoutId;
  position: OrderWithoutId;
  providerData: Record<string, any>;
}

const preNewOrder = async (order: OrderWithoutId) => {
  const newId = random();
  const {
    providerId, providerType, platform, copyId,
    symbol, direction, volume,
    orderType, limitPrice, stopPrice, stopLoss, takeProfit,
    label = 'user-create',
    comment = `user-create-${newId}`,
    userId, userEmail, userName, userPicture,
  } = order;

  const doc = {
    _id: `${providerId}-${newId}`,
    ...(copyId && { copyId }),
    providerId,
    providerType,
    platform,
    status: OrderStatus.idea,

    symbol,
    direction,
    volume,

    orderType,
    limitPrice,
    stopPrice,
    stopLoss,
    takeProfit,
    label,
    comment,

    userId,
    userEmail,
    userName,
    userPicture,
    sourceType: 'user',
    tag: 'newOrder',

    updatedAt: new Date(),
    createdAt: new Date(),
  };

  Mongo.collection<Order>('orders').insertOne({ // non-blocking
    ...doc,
    updatedLogs: [doc],
  });

  return doc;
};

const postNewOrder = async (requestOrder: Order, res: NewOrderRes) => {
  const { order, position, providerData } = res;
  const updateDoc = {
    ...order,
    ...(requestOrder.orderType === OrderType.market && position),
    ..._.omit(providerData, ['symbolIds', 'prices']),
    sourceType: 'user',
    tag: 'postNewOrder',
    updatedAt: new Date(),
  };

  await Mongo.collection<Order>('orders').updateOne(
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

const newOrder = async (req: NewOrderReq) => {
  const { order, options } = req;
  const { platform } = order;

  const requestOrder = await preNewOrder(order);

  let result: NewOrderRes;
  switch (platform) {
    case AccountPlatform.ctrader: {
      result = await newOrderCTrader({ ...req, ...options, requestOrder });
      break;
    }
    case AccountPlatform.metatrader: {
      result = await newOrderMetaTrader({ ...req, ...options, requestOrder });
      break;
    }
    default: {
      throw new Error(`Unhandled platform ${platform}`);
    }
  }

  const updateOrder = await postNewOrder(requestOrder, result);

  return {
    ...requestOrder,
    ...updateOrder,
  };
};

export default newOrder;

export type { NewOrderRes };
