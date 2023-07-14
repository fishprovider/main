import { send } from '@fishprovider/core/dist/libs/notif';
import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import type { Account, Lock } from '@fishprovider/utils/dist/types/Account.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';
import _ from 'lodash';
import moment from 'moment';

const isEqualLock = (lock1: Lock, lock2: Lock) => lock1.type === lock2.type
  && _.isEqual(lock1.value, lock2.value)
  && lock1.lockByUserId === lock2.lockByUserId
  && lock1.lockByUserName === lock2.lockByUserName
  && lock1.lockMessage === lock2.lockMessage;

const unlockHandler = async (lock: Lock, providerId: string) => {
  await Mongo.collection<Account>('accounts').updateOne(
    {
      _id: providerId,
    },
    {
      $pull: {
        locks: {
          type: lock.type,
          ...(lock.value && {
            value: lock.value,
          }),
          lockMessage: lock.lockMessage,
          lockByUserId: lock.lockByUserId,
          lockByUserName: lock.lockByUserName,
        },
      },
    },
  );
};

const lockHandler = async (lock: Lock, providerId: string) => {
  const msg = `Lock account ${providerId}, ${JSON.stringify(lock)}`;
  Logger.warn(msg);
  send(msg, [], `p-${providerId}`);

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
};

const lockAccount = async ({ data, userInfo }: {
  data: {
    providerId: string,
    lock: Lock,
    unlock?: boolean,
  }
  userInfo: User,
}) => {
  const { providerId, lock, unlock } = data;
  if (!providerId || !lock) {
    return { error: ErrorType.badRequest };
  }

  const {
    isAdminWeb, isTraderProvider, isProtectorProvider,
  } = getRoleProvider(userInfo.roles, providerId);
  if (!(isTraderProvider || isProtectorProvider)) {
    return { error: ErrorType.accessDenied };
  }

  const account = await Mongo.collection<Account>('accounts').findOne({
    _id: providerId,
  }, {
    projection: {
      locks: 1,
    },
  });
  if (!account) {
    return { error: ErrorType.accountNotFound };
  }

  const {
    locks = [],
  } = account;

  const lockIndex = locks.findIndex((item) => isEqualLock(item, lock));
  if (lockIndex >= 0) {
    if (!unlock) {
      return { error: ErrorType.badRequest };
    }
    if (!(isAdminWeb || moment(lock.lockUntil) < moment())) {
      return { error: ErrorType.accessDenied };
    }

    await unlockHandler(lock, providerId);

    return {
      result: {
        _id: providerId,
        locks: locks.splice(lockIndex, 1),
      },
    };
  }

  //
  // no lock found
  //

  if (unlock) {
    return { error: ErrorType.badRequest };
  }
  if (!(isTraderProvider || isProtectorProvider)) {
    return { error: ErrorType.accessDenied };
  }

  await lockHandler(lock, providerId);

  return {
    result: {
      _id: providerId,
      locks: [...locks, lock],
    },
  };
};

export default lockAccount;
