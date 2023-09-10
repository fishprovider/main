import { ProviderPlatform } from '@fishprovider/utils/dist/constants/account';
import type { Config } from '@fishprovider/utils/dist/types/Account.model';
import type { Order, OrderWithoutId } from '@fishprovider/utils/dist/types/Order.model';
import type { Price } from '@fishprovider/utils/dist/types/Price.model';
import _ from 'lodash';

import updateOrderCTrader from '~libs/ctrader/commands/updateOrder';
import updateOrderMetaTrader from '~libs/metatrader/commands/updateOrder';
import { preCommandOrder } from '~utils/command';

interface UpdateOrderReqOptions {
  config: Config,
  prices?: Record<string, Price>,
  stopLoss?: number,
  takeProfit?: number,
  limitPrice?: number,
  stopPrice?: number,
  volume?: number,
}

interface UpdateOrderReq {
  order: Order,
  options: UpdateOrderReqOptions,
}

interface UpdateOrderRes {
  order: OrderWithoutId,
  position: OrderWithoutId,
  providerData: Record<string, any>;
}

const postUpdateOrder = async (
  requestOrder: Order,
  options?: Record<string, any>,
  res?: UpdateOrderRes,
) => {
  const { providerData } = res || {};
  const updateDoc = {
    ..._.omit(options, ['config']),
    ..._.omit(providerData, ['symbolIds', 'prices']),
    sourceType: 'user',
    tag: 'updateOrder',
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

const updateOrder = async (req: UpdateOrderReq) => {
  const { order, options } = req;
  const { providerPlatform } = order;

  const requestOrder = await preCommandOrder(order);

  let res: UpdateOrderRes;
  switch (providerPlatform) {
    case ProviderPlatform.ctrader: {
      res = await updateOrderCTrader({ ...req, ...options, requestOrder });
      break;
    }
    case ProviderPlatform.metatrader: {
      res = await updateOrderMetaTrader({ ...req, ...options, requestOrder });
      break;
    }
    default: {
      throw new Error(`Unhandled providerPlatform ${providerPlatform}`);
    }
  }

  const updateOrderRes = await postUpdateOrder(requestOrder, options, res);

  return {
    ...requestOrder,
    ...updateOrderRes,
  };
};

export default updateOrder;

export type { UpdateOrderRes };
