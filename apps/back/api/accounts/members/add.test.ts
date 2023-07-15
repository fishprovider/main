import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import { Roles } from '@fishprovider/utils/dist/constants/user';
import type { User } from '@fishprovider/utils/dist/types/User.model';
import { jest } from '@jest/globals';

import { afterAllSetup, beforeAllSetup, getUser } from '~tests/utils';

import memberAdd from './add';

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
  email: 'test-trader-new@fishprovider.com',
  role: Roles.trader,
};

describe('memberAdd', () => {
  test('accessDenied', async () => {
    const { error } = await memberAdd({
      data: {
        providerId,
        ...member,
      },
      userInfo: {} as User,
    });
    expect(error).toEqual(ErrorType.accessDenied);
  });

  test('add', async () => {
    const { error, result } = await memberAdd({
      data: {
        providerId,
        ...member,
      },
      userInfo: user,
    });
    expect(error).toBeUndefined();
    expect(result).toBeDefined();
  });
});
