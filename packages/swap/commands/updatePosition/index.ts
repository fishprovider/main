import { AccountPlatform } from '@fishprovider/utils/dist/constants/account';
import type { Config } from '@fishprovider/utils/dist/types/Account.model';
import type { Order, OrderWithoutId } from '@fishprovider/utils/dist/types/Order.model';
import type { Price } from '@fishprovider/utils/dist/types/Price.model';
import _ from 'lodash';

import updatePositionCTrader from '~libs/ctrader/commands/updatePosition';
import updatePositionMetaTrader from '~libs/metatrader/commands/updatePosition';
import { preCommandOrder } from '~utils/command';

interface UpdatePositionReqOptions {
  config: Config,
  prices?: Record<string, Price>,
  stopLoss?: number,
  takeProfit?: number,
}

interface UpdatePositionReq {
  order: Order,
  options: UpdatePositionReqOptions,
}

interface UpdatePositionRes {
  order: OrderWithoutId,
  position: OrderWithoutId,
  providerData: Record<string, any>;
}

const postUpdatePosition = async (
  requestOrder: Order,
  options?: Record<string, any>,
  res?: UpdatePositionRes,
) => {
  const { providerData } = res || {};
  const updateDoc = {
    ..._.omit(options, ['config']),
    ..._.omit(providerData, ['symbolIds', 'prices']),
    sourceType: 'user',
    tag: 'updatePosition',
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

const updatePosition = async (req: UpdatePositionReq) => {
  const { order, options } = req;
  const { accountPlatform } = order;

  const requestOrder = await preCommandOrder(order);

  let res: UpdatePositionRes;
  switch (accountPlatform) {
    case AccountPlatform.ctrader: {
      res = await updatePositionCTrader({ ...req, ...options, requestOrder });
      break;
    }
    case AccountPlatform.metatrader: {
      res = await updatePositionMetaTrader({ ...req, ...options, requestOrder });
      break;
    }
    default: {
      throw new Error(`Unhandled accountPlatform ${accountPlatform}`);
    }
  }

  const updateOrder = await postUpdatePosition(requestOrder, options, res);

  return {
    ...requestOrder,
    ...updateOrder,
  };
};

export default updatePosition;

export type { UpdatePositionRes };
