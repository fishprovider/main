import { ProviderPlatform } from '@fishbot/utils/constants/account';
import type { Config } from '@fishbot/utils/types/Account.model';
import type { Order, OrderWithoutId } from '@fishbot/utils/types/Order.model';
import type { Price } from '@fishbot/utils/types/Price.model';
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

const updatePosition = async (req: UpdatePositionReq) => {
  const { order, options } = req;
  const { providerPlatform } = order;

  const requestOrder = await preCommandOrder(order);

  let res: UpdatePositionRes;
  switch (providerPlatform) {
    case ProviderPlatform.ctrader: {
      res = await updatePositionCTrader({ ...req, ...options, requestOrder });
      break;
    }
    case ProviderPlatform.metatrader: {
      res = await updatePositionMetaTrader({ ...req, ...options, requestOrder });
      break;
    }
    default: {
      throw new Error(`Unhandled providerPlatform ${providerPlatform}`);
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
