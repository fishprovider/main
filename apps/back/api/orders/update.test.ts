import { afterAllSetup, beforeAllSetup, getUser } from '@fishbot/swap/tests/utils';
import { ProviderPlatform, ProviderType } from '@fishbot/utils/constants/account';
import { ErrorType } from '@fishbot/utils/constants/error';
import { Direction, OrderStatus, OrderType } from '@fishbot/utils/constants/order';
import random from '@fishbot/utils/helpers/random';
import type { User } from '@fishbot/utils/types/User.model';
import { jest } from '@jest/globals';

import orderAdd from './add';
import orderUpdate from './update';

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
    const { error } = await orderUpdate({
      data: {
        order: {
          ...order,
          orderId: 'test',
        },
      },
      userInfo: {} as User,
    });
    expect(error).toEqual(ErrorType.accessDenied);
  });

  test('limitPrice', async () => {
    const { result: orderAdded, error: errorAdded } = await orderAdd({
      data: { order },
      userInfo: user,
    });
    expect(errorAdded).toBeUndefined();
    expect(orderAdded).toBeDefined();

    const { result, error } = await orderUpdate({
      data: {
        order: {
          ...order,
          ...orderAdded,
        },
        options: {
          limitPrice: 0.6,
          volume: 2000,
          stopLoss: 0.4,
          takeProfit: 0.8,
        },
      },
      userInfo: user,
    });
    expect(error).toBeUndefined();
    expect(result).toBeDefined();
  });
});
