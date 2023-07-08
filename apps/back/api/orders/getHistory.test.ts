import { afterAllSetup, beforeAllSetup, getUser } from '@fishprovider/swap/tests/utils';
import { ErrorType } from '@fishprovider/utils/constants/error';
import type { User } from '@fishprovider/utils/types/User.model';
import { jest } from '@jest/globals';

import orderGetHistory from './getHistory';

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
const providerIdPublic = 'copy';
const providerIdPrivate = 'swap';

describe('orderGetHistory', () => {
  test('accessDenied', async () => {
    const { error } = await orderGetHistory({
      data: {
        providerId: providerIdPrivate,
        weeks: 1,
      },
      userInfo: {} as User,
    });
    expect(error).toEqual(ErrorType.accessDenied);
  });

  test('user', async () => {
    const { result, error } = await orderGetHistory({
      data: {
        providerId: providerIdPublic,
        weeks: 1,
      },
      userInfo: user,
    });
    expect(error).toBeUndefined();
    expect(result).toBeDefined();
  });

  test('reload', async () => {
    const { result, error } = await orderGetHistory({
      data: {
        providerId,
        weeks: 1,
        reload: true,
      },
      userInfo: user,
    });
    expect(error).toBeUndefined();
    expect(result).toBeDefined();
  });
});
