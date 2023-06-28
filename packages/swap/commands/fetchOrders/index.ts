import { ProviderPlatform, ProviderType } from '@fishbot/utils/constants/account';
import { OrderStatus } from '@fishbot/utils/constants/order';
import { redisKeys } from '@fishbot/utils/constants/redis';
import type { Config } from '@fishbot/utils/types/Account.model';
import type { Order, OrderWithoutId } from '@fishbot/utils/types/Order.model';
import _ from 'lodash';
import moment from 'moment';

import getOrdersCTrader from '~libs/ctrader/commands/getOrders';
import getOrdersMetaTrader from '~libs/metatrader/commands/getOrders';
import { findRequestOrder, findRequestOrders } from '~utils/command';

interface FetchOrdersReqOptions {
  config?: Config,
  connection?: any,
  accountId?: string,
  updateClosedOrders?: boolean,
  getLive?: boolean,
  getPending?: boolean,
}

interface FetchOrdersReq {
  providerId: string,
  providerType: ProviderType,
  providerPlatform: ProviderPlatform,
  options?: FetchOrdersReqOptions,
}

interface FetchOrdersRes {
  orders?: OrderWithoutId[];
  positions?: OrderWithoutId[];
  updateClosedOrders?: boolean,
  providerData?: Record<string, any>;
  updatedAt: Date;
}

const saveOrders = async (
  providerId: string,
  res: FetchOrdersRes,
) => {
  const { orders, positions, updateClosedOrders } = res;

  const requestOrders = await findRequestOrders(
    providerId,
    [...(orders || []), ...(positions || [])],
  );
  const finalOrders: Order[] = [];
  const finalPositions: Order[] = [];
  const slimOrders: Order[] = [];
  const slimPositions: Order[] = [];

  const findPendingOrders = async () => {
    if (!orders) return;

    for (const order of orders) {
      const requestOrder = await findRequestOrder(order, requestOrders);
      requestOrders[requestOrder._id] = requestOrder;
      finalOrders.push(requestOrder);
      slimOrders.push(_.omit(requestOrder, ['providerData', 'updatedLogs']));
    }
  };

  const findLiveOrders = async () => {
    if (!positions) return;

    for (const order of positions) {
      const requestOrder = await findRequestOrder(order, requestOrders);
      requestOrders[requestOrder._id] = requestOrder;
      finalPositions.push(requestOrder);
      slimPositions.push(_.omit(requestOrder, ['providerData', 'updatedLogs']));
    }
  };

  await Promise.all([
    findPendingOrders(),
    findLiveOrders(),
  ]);

  const savePendingOrders = async () => {
    if (!orders) return;

    const updateRedis = async () => {
      const pendingOrdersStr = JSON.stringify(slimOrders);
      await Promise.all([
        Redis.publish(redisKeys.pendingOrders(providerId), pendingOrdersStr),
        Redis.set(redisKeys.pendingOrders(providerId), pendingOrdersStr, {
          EX: 60 * 60 * 24 * 7,
        }),
      ]);
    };

    const updateFirebase = async () => {
      await Firebase.firestore().collection('pendingOrders').doc(providerId).set({ orders: slimOrders });
    };

    await Promise.all([
      updateRedis(),
      updateFirebase(),
    ]);
  };

  const saveLiveOrders = async () => {
    if (!positions) return;

    const updateRedis = async () => {
      const liveOrdersStr = JSON.stringify(slimPositions);
      await Promise.all([
        Redis.publish(redisKeys.liveOrders(providerId), liveOrdersStr),
        Redis.set(redisKeys.liveOrders(providerId), liveOrdersStr, {
          EX: 60 * 60 * 24 * 7,
        }),
      ]);
    };

    const updateFirebase = async () => {
      await Firebase.firestore().collection('liveOrders').doc(providerId).set({ orders: slimPositions });
    };

    await Promise.all([
      updateRedis(),
      updateFirebase(),
    ]);
  };

  const saveClosedOrders = async () => {
    if (!updateClosedOrders) return;

    const openingOrderIds = [
      ...slimOrders.map((item) => item._id),
      ...slimPositions.map((item) => item._id),
    ];
    await Mongo.collection<Order>('orders').updateMany({
      _id: { $nin: openingOrderIds },
      providerId,
      createdAt: { $lt: moment().subtract(5, 'minutes').toDate() },
    }, {
      $set: {
        status: OrderStatus.closed,
      },
    });
  };

  // non-blocking
  Promise.all([
    savePendingOrders(),
    saveLiveOrders(),
    saveClosedOrders(),
  ]);

  return {
    ...(orders && { orders: finalOrders }),
    ...(positions && { positions: finalPositions }),
  };
};

const fetchOrders = async (req: FetchOrdersReq) => {
  const {
    providerId, providerPlatform, options,
  } = req;

  let res: FetchOrdersRes;
  switch (providerPlatform) {
    case ProviderPlatform.ctrader: {
      res = await getOrdersCTrader({ ...req, ...options });
      break;
    }
    case ProviderPlatform.metatrader: {
      res = await getOrdersMetaTrader({ ...req, ...options });
      break;
    }
    default: {
      throw new Error(`Unhandled providerPlatform ${providerPlatform}`);
    }
  }

  const { orders, positions } = await saveOrders(
    providerId,
    res,
  );
  return {
    ...res,
    orders,
    positions,
  };
};

export default fetchOrders;
