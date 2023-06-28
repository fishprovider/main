import { afterAllSetup, beforeAllSetup, getUser } from '@fishbot/swap/tests/utils';
import { ProviderPlatform, ProviderType } from '@fishbot/utils/constants/account';
import { ErrorType } from '@fishbot/utils/constants/error';
import { Direction, OrderStatus, OrderType } from '@fishbot/utils/constants/order';
import random from '@fishbot/utils/helpers/random';
import type { User } from '@fishbot/utils/types/User.model';
import { jest } from '@jest/globals';

import type { } from '~types/Session.model';

import orderAdd from './add';

const env = {
  typeId: process.env.TYPE_ID || '',
};

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

const order = {
  _id: `${env.typeId}-${random()}`,
  providerId: 'back',
  providerType: ProviderType.icmarkets,
  providerPlatform: ProviderPlatform.ctrader,
  orderType: OrderType.limit,
  status: OrderStatus.idea,

  symbol: 'EURUSD',
  direction: Direction.buy,
  volume: 1000,
  limitPrice: 0.1,
};

describe('orderAdd', () => {
  test('accessDenied', async () => {
    const { error } = await orderAdd({
      data: { order },
      userInfo: {} as User,
    });
    expect(error).toEqual(ErrorType.accessDenied);
  });

  test('limit', async () => {
    const { result, error } = await orderAdd({
      data: { order },
      userInfo: user,
    });
    expect(error).toBeUndefined();
    expect(result).toBeDefined();
  });
});
