import { afterAllSetup, beforeAllSetup, getUser } from '@fishbot/swap/tests/utils';
import { LockType } from '@fishbot/utils/constants/account';
import { ErrorType } from '@fishbot/utils/constants/error';
import type { Lock } from '@fishbot/utils/types/Account.model';
import type { User } from '@fishbot/utils/types/User.model';
import { jest } from '@jest/globals';
import moment from 'moment';

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
