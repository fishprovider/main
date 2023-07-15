import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import type { User } from '@fishprovider/utils/dist/types/User.model';
import { jest } from '@jest/globals';

import { afterAllSetup, beforeAllSetup, getUser } from '~tests/utils';

import memberFetch from './fetch';

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

describe('memberFetch', () => {
  test('accessDenied', async () => {
    const { error } = await memberFetch({
      data: {
        providerId,
      },
      userInfo: {} as User,
    });
    expect(error).toEqual(ErrorType.accessDenied);
  });

  test('fetch', async () => {
    const { error, result } = await memberFetch({
      data: {
        providerId,
      },
      userInfo: user,
    });
    expect(error).toBeUndefined();
    expect(result).toBeDefined();
    expect(result?.members?.length).toBeGreaterThan(0);
  });
});
