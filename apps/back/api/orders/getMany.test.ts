import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import type { User } from '@fishprovider/utils/dist/types/User.model';
import { jest } from '@jest/globals';

import { afterAllSetup, beforeAllSetup, getUser } from '~tests/utils';

import orderGetMany from './getMany';

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
const providerIdPublic = 'ctrader';
const providerIdPrivate = 'swap';

describe('orderGetMany', () => {
  test('accessDenied', async () => {
    const { error } = await orderGetMany({
      data: {
        providerId: providerIdPrivate,
      },
      userInfo: {} as User,
    });
    expect(error).toEqual(ErrorType.accessDenied);
  });

  test('user', async () => {
    const { result, error } = await orderGetMany({
      data: {
        providerId: providerIdPublic,
      },
      userInfo: user,
    });
    expect(error).toBeUndefined();
    expect(result?.orders).toBeDefined();
    expect(result?.positions).toBeDefined();
  });

  test('reload', async () => {
    const { result, error } = await orderGetMany({
      data: {
        providerId,
        reload: true,
      },
      userInfo: user,
    });
    expect(error).toBeUndefined();
    expect(result?.orders).toBeDefined();
    expect(result?.positions).toBeDefined();
  });
});
