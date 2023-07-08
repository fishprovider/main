import * as agenda from '@fishprovider/core/libs/agenda';
import * as firebase from '@fishprovider/core/libs/firebase';
import * as mongo from '@fishprovider/core/libs/mongo';
import * as redis from '@fishprovider/core/libs/redis';
import { isMarketClosed as isMarketClosedCTrader } from '@fishprovider/ctrader/utils/validate';
import { isMarketClosed as isMarketClosedMetaTrader } from '@fishprovider/metatrader/utils/validate';
import { ProviderPlatform, ProviderType } from '@fishprovider/utils/constants/account';
import { ErrorType } from '@fishprovider/utils/constants/error';
import { Direction, OrderStatus, OrderType } from '@fishprovider/utils/constants/order';
import delay from '@fishprovider/utils/helpers/delay';
import random from '@fishprovider/utils/helpers/random';
import type { Account, Config } from '@fishprovider/utils/types/Account.model';
import type { Order, OrderWithoutId } from '@fishprovider/utils/types/Order.model';
import type { User } from '@fishprovider/utils/types/User.model';
import type { AsyncReturnType } from 'type-fest';

import newOrder from '~commands/newOrder';
import removeOrder from '~commands/removeOrder';
import removePosition from '~commands/removePosition';
import { getPrices } from '~utils/price';

const getConfig = async (providerId: string) => {
  const account = await Mongo.collection<Account>('accounts').findOne(
    { _id: providerId },
    {
      projection: {
        config: 1,
      },
    },
  );
  if (!account) {
    throw new Error(ErrorType.accountNotFound);
  }
  return account.config;
};

const getUser = async (userId = 'test') => {
  const user = await Mongo.collection<User>('users').findOne(
    { _id: userId },
  );
  if (!user) {
    throw new Error(ErrorType.userNotFound);
  }
  return user;
};

const isMarketClosed = (providerType: ProviderType, errMsg: string) => {
  if (providerType === ProviderType.icmarkets) {
    return isMarketClosedCTrader(errMsg);
  }
  if (providerType === ProviderType.exness) {
    return isMarketClosedMetaTrader(errMsg);
  }
  return false;
};

const checkOrder = (
  order: OrderWithoutId,
  orderToCheck: Partial<Order>,
  status: OrderStatus,
) => {
  if (status === OrderStatus.pending) {
    expect(order.orderId).toBeDefined();
  }
  if (status === OrderStatus.live) {
    expect(order.positionId).toBeDefined();
  }
  expect(order.providerType).toEqual(orderToCheck.providerType);
  expect(order.providerId).toEqual(orderToCheck.providerId);
  expect(order.symbol).toEqual(orderToCheck.symbol);
  expect(order.symbolId).toBeDefined();
  expect(order.direction).toEqual(orderToCheck.direction);
  expect(order.volume).toEqual(orderToCheck.volume);

  if (orderToCheck.stopLoss) {
    expect(order.stopLoss).toEqual(orderToCheck.stopLoss);
  }
  if (orderToCheck.takeProfit) {
    expect(order.takeProfit).toEqual(orderToCheck.takeProfit);
  }

  if (status === OrderStatus.pending) {
    if (orderToCheck.orderType === OrderType.limit && orderToCheck.limitPrice) {
      expect(order.limitPrice).toEqual(orderToCheck.limitPrice);
    }
    if (orderToCheck.orderType === OrderType.stop && orderToCheck.stopPrice) {
      expect(order.stopPrice).toEqual(orderToCheck.stopPrice);
    }
  }
  if (status === OrderStatus.live) {
    if (order.providerType === ProviderType.icmarkets) {
      expect(order.price).toBeGreaterThan(0);
      expect(order.margin).toBeGreaterThan(0);
      expect(order.commission).toBeLessThan(0);
      expect(order.swap).toEqual(0);
    }
  }
};

const newMarketOrder = async (config: Config, providerId: string, providerType: ProviderType) => {
  const orderToNew = {
    _id: `${providerId}-${random()}`,
    providerId,
    providerType,
    providerPlatform: providerType === ProviderType.exness
      ? ProviderPlatform.metatrader : ProviderPlatform.ctrader,
    status: OrderStatus.idea,
    direction: Direction.buy,
    symbol: providerType === ProviderType.exness ? 'ETHUSD' : 'EURUSD',
    volume: providerType === ProviderType.exness ? 0.2 : 2000,
    orderType: OrderType.market,
    userName: 'test',
  };

  const prices = await getPrices(providerType, [orderToNew.symbol]);
  const position = await newOrder({ order: orderToNew, options: { config, prices } });

  return { orderToNew, position };
};

const newLimitOrder = async (config: Config, providerId: string, providerType: ProviderType) => {
  const orderToNew = {
    _id: `${providerId}-${random()}`,
    providerId,
    providerType,
    providerPlatform: providerType === ProviderType.exness
      ? ProviderPlatform.metatrader : ProviderPlatform.ctrader,
    status: OrderStatus.idea,
    direction: Direction.buy,
    symbol: providerType === ProviderType.exness ? 'ETHUSD' : 'EURUSD',
    volume: providerType === ProviderType.exness ? 0.2 : 2000,
    orderType: OrderType.limit,
    limitPrice: 0.2,
    stopLoss: 0.1,
    takeProfit: 0.3,
    userName: 'test',
  };

  const prices = await getPrices(providerType, [orderToNew.symbol]);
  const order = await newOrder({ order: orderToNew, options: { config, prices } });

  return { orderToNew, order };
};

const testMarketOrder = async (
  handler: (_: AsyncReturnType<typeof newMarketOrder>) => Promise<void>,
  config: Config,
  providerId: string,
  providerType: ProviderType,
  options?: {
    skipRemovePosition?: boolean;
  },
) => {
  let positionNew: Order | undefined;

  try {
    const res = await newMarketOrder(config, providerId, providerType);

    const { orderToNew, position } = res;
    positionNew = { ...orderToNew, ...position };

    await handler(res);

    if (options?.skipRemovePosition) {
      positionNew = undefined;
    }
  } catch (err: any) {
    if (isMarketClosed(providerType, err.message)) {
      console.warn('Market is closed');
    } else {
      throw err;
    }
  } finally {
    if (positionNew) {
      await removePosition({ order: positionNew, options: { config } }).catch((err: any) => {
        console.warn('Failed to removePosition', err);
      });
    }
  }
};

const testLimitOrder = async (
  handler: (_: AsyncReturnType<typeof newLimitOrder>) => Promise<void>,
  config: Config,
  providerId: string,
  providerType: ProviderType,
  options?: {
    skipRemoveOrder?: boolean;
  },
) => {
  let orderNew: Order | undefined;

  try {
    const res = await newLimitOrder(config, providerId, providerType);

    const { orderToNew, order } = res;
    orderNew = { ...orderToNew, ...order };

    await handler(res);

    if (options?.skipRemoveOrder) {
      orderNew = undefined;
    }
  } finally {
    if (orderNew) {
      await removeOrder({ order: orderNew, options: { config } }).catch((err: any) => {
        console.warn('Failed to removeOrder', err);
      });
    }
  }
};

const beforeAllSetup = (
  done: jest.DoneCallback,
  handler: () => Promise<void> = async () => undefined,
) => {
  (async () => {
    try {
      await redis.start();
      await firebase.start();
      await mongo.start();
      await agenda.start({} as any);
      await handler();
    } finally {
      done();
    }
  })();
};

const afterAllSetup = (
  done: jest.DoneCallback,
  handler: () => Promise<void> = async () => undefined,
) => {
  (async () => {
    try {
      await handler();
      await agenda.destroyAsync();
      await mongo.destroyAsync();
      await firebase.destroyAsync();
      await redis.destroyAsync();
    } finally {
      done();
    }
  })();
};

const waitForSpyObjCalled = async (spyObj: jest.SpyInstance) => {
  Logger.debug('waitForSpyObjCalled start', spyObj.mock.results);
  let isCalled = spyObj.mock.results.length > 0;
  while (!isCalled) {
    Logger.debug('waitForSpyObjCalled wait', spyObj.mock.results.length);
    await delay(500);
    isCalled = spyObj.mock.results.length > 0;
  }

  const res = await spyObj.mock.results[0]?.value;
  Logger.debug('waitForSpyObjCalled end', spyObj.mock.results, res);
  return res;
};

export {
  afterAllSetup,
  beforeAllSetup,
  checkOrder,
  getConfig,
  getUser,
  testLimitOrder,
  testMarketOrder,
  waitForSpyObjCalled,
};
