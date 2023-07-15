import { LockType } from '@fishprovider/utils/dist/constants/account';
import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import type { Lock } from '@fishprovider/utils/dist/types/Account.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';
import { jest } from '@jest/globals';
import moment from 'moment';

import { afterAllSetup, beforeAllSetup, getUser } from '~tests/utils';

import lockMember from './member';

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
const userId = 'test-trader-new';

const lock = {
  type: LockType.open,
  lockFrom: new Date(),
  lockUntil: moment().add(1, 'hour').toDate(),
  lockMessage: 'test',
  lockByUserId: 'bot',
  lockByUserName: 'Bot',
};

describe('lockMember', () => {
  test('accessDenied', async () => {
    const { error } = await lockMember({
      data: {
        providerId,
        userId,
        lock: {} as Lock,
      },
      userInfo: {} as User,
    });
    expect(error).toEqual(ErrorType.accessDenied);
  });

  test('lock', async () => {
    const { error, result } = await lockMember({
      data: {
        providerId,
        userId,
        lock,
      },
      userInfo: user,
    });
    expect(error).toBeUndefined();
    expect(result).toBeDefined();
  });
});
