import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import type { User } from '@fishprovider/utils/dist/types/User.model';
import { jest } from '@jest/globals';

import { afterAllSetup, beforeAllSetup } from '~tests/utils';
import type { } from '~types/Session.model';

import accountGet from './get';

beforeAll((done) => {
  beforeAllSetup(done);
});

afterAll((done) => {
  afterAllSetup(done);
});

afterEach(() => {
  jest.restoreAllMocks();
});

const providerIdPublic = 'back';
const providerIdPrivate = 'swap';

describe('accountGet', () => {
  test('accountNotFound', async () => {
    const { error } = await accountGet({
      data: {
        providerId: 'accountNotFound',
      },
      userInfo: {} as User,
    });
    expect(error).toEqual(ErrorType.accountNotFound);
  });

  test('public', async () => {
    const { error, result } = await accountGet({
      data: {
        providerId: providerIdPublic,
      },
      userInfo: {} as User,
    });
    expect(error).toBeUndefined();
    expect(result).toBeDefined();
    expect(result?._id).toEqual(providerIdPublic);
  });

  test('user accountNotFound', async () => {
    const { error } = await accountGet({
      data: {
        providerId: providerIdPrivate,
      },
      userInfo: {
        uid: 'accountNotFound',
      } as User,
    });
    expect(error).toEqual(ErrorType.accountNotFound);
  });

  test('user', async () => {
    const { error, result } = await accountGet({
      data: {
        providerId: providerIdPrivate,
      },
      userInfo: {
        uid: 'test-trader',
        roles: {
          traderProviders: {
            [providerIdPrivate]: true,
          },
        },
      } as any,
    });
    expect(error).toBeUndefined();
    expect(result).toBeDefined();
    expect(result?._id).toEqual(providerIdPrivate);
  });

  test('manager', async () => {
    const { error, result } = await accountGet({
      data: {
        providerId: providerIdPrivate,
      },
      userInfo: {
        roles: {
          managerWeb: true,
        },
      } as User,
    });
    expect(error).toBeUndefined();
    expect(result).toBeDefined();
    expect(result?._id).toEqual(providerIdPrivate);
  });

  test('reload', async () => {
    const { error, result } = await accountGet({
      data: {
        providerId: providerIdPublic,
        reload: true,
      },
      userInfo: {} as User,
    });
    expect(error).toBeUndefined();
    expect(result).toBeDefined();
    expect(result?._id).toEqual(providerIdPublic);
    expect(result?.balance).toBeDefined();
    expect(result?.providerData).toBeDefined();
  });
});
