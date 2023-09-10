import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import { Roles } from '@fishprovider/utils/dist/constants/user';
import type { User } from '@fishprovider/utils/dist/types/User.model';
import { jest } from '@jest/globals';

import { afterAllSetup, beforeAllSetup, getUser } from '~tests/utils';

import memberRemove from './remove';

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
const member = {
  userId: 'test-trader-new',
  email: 'test-trader-new@fishprovider.com',
  role: Roles.trader,
  name: 'test-trader-new',
};

describe('memberRemove', () => {
  test('accessDenied', async () => {
    const { error } = await memberRemove({
      data: {
        providerId,
        email: member.email,
      },
      userInfo: {} as User,
    });
    expect(error).toEqual(ErrorType.accessDenied);
  });

  test('remove', async () => {
    const { error, result } = await memberRemove({
      data: {
        providerId,
        email: member.email,
      },
      userInfo: user,
    });
    expect(error).toBeUndefined();
    expect(result).toBeDefined();
  });
});
