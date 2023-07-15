import { LockType } from '@fishprovider/utils/dist/constants/account';
import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import type { Account, Lock } from '@fishprovider/utils/dist/types/Account.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';
import { jest } from '@jest/globals';
import moment from 'moment';

import { afterAllSetup, beforeAllSetup, getUser } from '~tests/utils';

import lockAccount from './account';

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

const lock = {
  type: LockType.open,
  lockFrom: new Date(),
  lockUntil: moment().add(1, 'hour').toDate(),
  lockMessage: 'test',
  lockByUserId: 'bot',
  lockByUserName: 'Bot',
};

describe('lockAccount', () => {
  test('accessDenied', async () => {
    const { error } = await lockAccount({
      data: {
        providerId,
        lock: {} as Lock,
      },
      userInfo: {} as User,
    });
    expect(error).toEqual(ErrorType.accessDenied);
  });

  test('accessDenied lock', async () => {
    await Mongo.collection<Account>('accounts').updateOne(
      {
        _id: providerId,
      },
      {
        $push: {
          locks: lock,
        },
      },
    );

    const { error } = await lockAccount({
      data: {
        providerId,
        lock,
      },
      userInfo: user,
    });
    expect(error).toEqual(ErrorType.accessDenied);
  });

  test('lock', async () => {
    await Mongo.collection<Account>('accounts').updateOne(
      {
        _id: providerId,
      },
      {
        $pull: {
          locks: { type: lock.type },
        },
      },
    );
    const { error, result } = await lockAccount({
      data: {
        providerId,
        lock,
      },
      userInfo: user,
    });
    expect(error).toBeUndefined();
    expect(result).toBeDefined();
    expect(result?.locks?.some((item) => item.type === lock.type)).toEqual(true);
  });

  test('unlock', async () => {
    const lockDone = {
      ...lock,
      lockFrom: moment().subtract(2, 'hour').toDate(),
      lockUntil: moment().subtract(1, 'hour').toDate(),
    };

    await Mongo.collection<Account>('accounts').updateOne(
      {
        _id: providerId,
      },
      {
        $pull: {
          locks: { type: lock.type },
        },
      },
    );

    await Mongo.collection<Account>('accounts').updateOne(
      {
        _id: providerId,
      },
      {
        $push: {
          locks: lockDone,
        },
      },
    );

    const { error, result } = await lockAccount({
      data: {
        providerId,
        lock: lockDone,
        unlock: true,
      },
      userInfo: user,
    });
    expect(error).toBeUndefined();
    expect(result).toBeDefined();
    expect(result?.locks?.some((item) => item.type === lock.type)).toEqual(false);
  });
});
