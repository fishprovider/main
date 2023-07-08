import * as firebase from '@fishprovider/core/libs/firebase';
import * as mongo from '@fishprovider/core/libs/mongo';
import * as redis from '@fishprovider/core/libs/redis';
import { isMarketClosed as isMarketClosedCTrader } from '@fishprovider/ctrader/utils/validate';
import newOrder from '@fishprovider/swap/commands/newOrder';
import removeOrder from '@fishprovider/swap/commands/removeOrder';
import removePosition from '@fishprovider/swap/commands/removePosition';
import { ProviderPlatform, ProviderType } from '@fishprovider/utils/constants/account';
import { Direction, OrderStatus, OrderType } from '@fishprovider/utils/constants/order';
import delay from '@fishprovider/utils/helpers/delay';
import random from '@fishprovider/utils/helpers/random';
import type { Account, Config } from '@fishprovider/utils/types/Account.model';
import type { Order } from '@fishprovider/utils/types/Order.model';
import type { AsyncReturnType } from 'type-fest';

import * as provider from '~services/provider';

const env = {
  typeId: process.env.TYPE_ID || '',
};

const getConfig = async () => {
  const account = await Mongo.collection<Account>('accounts').findOne(
    { _id: env.typeId },
    {
      projection: {
        config: 1,
      },
    },
  );
  if (!account) {
    throw new Error('Account not found');
  }
  return account.config;
};

const isMarketClosed = (providerType: ProviderType, errMsg: string) => {
  if (providerType === ProviderType.icmarkets) {
    return isMarketClosedCTrader(errMsg);
  }
  return false;
};

const newMarketOrder = async (config: Config, orderToNewInput?: Record<string, any>) => {
  const orderToNew = {
    _id: `${env.typeId}-${random()}`,
    providerId: env.typeId,
    providerType: ProviderType.icmarkets,
    providerPlatform: ProviderPlatform.ctrader,
    status: OrderStatus.idea,
    symbol: 'EURUSD',
    direction: Direction.buy,
    volume: 2000,
    orderType: OrderType.market,
    userName: 'test',
    ...orderToNewInput,
  };

  const position = await newOrder({ order: orderToNew, options: { config } });

  return { position, orderToNew };
};

const newLimitOrder = async (config: Config, orderToNewInput?: Record<string, any>) => {
  const orderToNew = {
    _id: `${env.typeId}-${random()}`,
    providerId: env.typeId,
    providerType: ProviderType.icmarkets,
    providerPlatform: ProviderPlatform.ctrader,
    status: OrderStatus.idea,
    symbol: 'EURUSD',
    direction: Direction.buy,
    volume: 1000,
    orderType: OrderType.limit,
    limitPrice: 0.2,
    stopLoss: 0.1,
    takeProfit: 0.3,
    userName: 'test',
    ...orderToNewInput,
  };

  const order = await newOrder({ order: orderToNew, options: { config } });

  return { order, orderToNew };
};

const testMarketOrder = async (
  handler: (_: AsyncReturnType<typeof newMarketOrder>) => Promise<void>,
  config: Config,
  orderToNewInput?: Record<string, any>,
  option?: {
    skipRemovePosition?: boolean;
  },
) => {
  let positionNew: Order | undefined;

  try {
    const res = await newMarketOrder(config, orderToNewInput);

    const { orderToNew, position } = res;
    positionNew = { ...orderToNew, ...position };

    await handler(res);

    if (option?.skipRemovePosition) {
      positionNew = undefined;
    }
  } catch (err: any) {
    if (isMarketClosed(ProviderType.icmarkets, err.message)) {
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
  orderToNewInput?: Record<string, any>,
  option?: {
    skipRemoveOrder?: boolean;
  },
) => {
  let orderNew: Order | undefined;

  try {
    const res = await newLimitOrder(config, orderToNewInput);

    const { orderToNew, order } = res;
    orderNew = { ...orderToNew, ...order };

    await handler(res);

    if (option?.skipRemoveOrder) {
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

const beforeAllSetup = (
  done: jest.DoneCallback,
  handler: () => Promise<void> = async () => undefined,
) => {
  (async () => {
    try {
      await mongo.start();
      await firebase.start();
      await redis.start();
      await provider.start();
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
      await provider.destroy();
      await redis.destroyAsync();
      await firebase.destroyAsync();
      await mongo.destroyAsync();
    } finally {
      done();
    }
  })();
};

export {
  afterAllSetup,
  beforeAllSetup,
  getConfig,
  isMarketClosed,
  testLimitOrder,
  testMarketOrder,
  waitForSpyObjCalled,
};
