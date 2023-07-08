import { afterAllSetup, beforeAllSetup, getUser } from '@fishprovider/swap/tests/utils';
import { ProviderPlatform, ProviderType } from '@fishprovider/utils/constants/account';
import { ErrorType } from '@fishprovider/utils/constants/error';
import { Direction, OrderStatus, OrderType } from '@fishprovider/utils/constants/order';
import random from '@fishprovider/utils/helpers/random';
import type { User } from '@fishprovider/utils/types/User.model';
import { jest } from '@jest/globals';

import orderAdd from './add';
import orderUpdateSettings from './updateSettings';

let user: User;

beforeAll((done) => {
  beforeAllSetup(done, async () => {
    user = await getUser();
  });
});

afterAll((done) => {
  afterAllSetup(done);
});

afterEach(() => {
  jest.restoreAllMocks();
});

const providerId = 'back';
const order = {
  _id: `${providerId}-${random()}`,
  providerId,
  providerType: ProviderType.icmarkets,
  providerPlatform: ProviderPlatform.ctrader,
  orderType: OrderType.limit,
  status: OrderStatus.pending,

  symbol: 'EURUSD',
  direction: Direction.buy,
  volume: 1000,
  limitPrice: 0.5,
};

describe('orderUpdate', () => {
  test('accessDenied', async () => {
    const { error } = await orderUpdateSettings({
      data: {
        providerId,
        orderId: 'test',
        lock: true,
      },
      userInfo: {} as User,
    });
    expect(error).toEqual(ErrorType.accessDenied);
  });

  test('lock', async () => {
    const { result: orderAdded, error: errorAdded } = await orderAdd({
      data: { order },
      userInfo: user,
    });
    expect(errorAdded).toBeUndefined();
    expect(orderAdded).toBeDefined();

    const { result, error } = await orderUpdateSettings({
      data: {
        providerId,
        orderId: order._id,
        lock: true,
      },
      userInfo: user,
    });
    expect(error).toBeUndefined();
    expect(result).toBeDefined();
  });

  test('chat', async () => {
    const { result: orderAdded, error: errorAdded } = await orderAdd({
      data: { order },
      userInfo: user,
    });
    expect(errorAdded).toBeUndefined();
    expect(orderAdded).toBeDefined();

    const { result, error } = await orderUpdateSettings({
      data: {
        providerId,
        orderId: order._id,
        chat: 'test',
      },
      userInfo: user,
    });
    expect(error).toBeUndefined();
    expect(result).toBeDefined();
  });
});
