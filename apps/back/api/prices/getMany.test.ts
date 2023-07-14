import { afterAllSetup, beforeAllSetup, getUser } from '@fishprovider/swap/dist/tests/utils';
import { ProviderType } from '@fishprovider/utils/dist/constants/account';
import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import type { User } from '@fishprovider/utils/dist/types/User.model';
import { jest } from '@jest/globals';

import priceGetMany from './getMany';

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

describe('priceGetMany', () => {
  test('accessDenied', async () => {
    const { error } = await priceGetMany({
      data: {
        providerType: ProviderType.icmarkets,
        symbols: ['EURUSD'],
      },
      userInfo: {} as User,
    });
    expect(error).toEqual(ErrorType.accessDenied);
  });

  test('user', async () => {
    const { result, error } = await priceGetMany({
      data: {
        providerType: ProviderType.icmarkets,
        symbols: ['EURUSD', 'USDJPY'],
      },
      userInfo: {
        uid: user.uid,
      } as User,
    });
    expect(error).toBeUndefined();
    expect(result?.length).toEqual(2);
  });
});
