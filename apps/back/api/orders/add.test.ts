import { ProviderPlatform, ProviderType } from '@fishprovider/utils/dist/constants/account';
import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import { Direction, OrderStatus, OrderType } from '@fishprovider/utils/dist/constants/order';
import random from '@fishprovider/utils/dist/helpers/random';
import type { User } from '@fishprovider/utils/dist/types/User.model';
import { jest } from '@jest/globals';

import { afterAllSetup, beforeAllSetup, getUser } from '~tests/utils';
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
