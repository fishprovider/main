import { send } from '@fishbot/core/libs/notif';
import { ErrorType } from '@fishbot/utils/constants/error';
import { getRoleProvider } from '@fishbot/utils/helpers/user';
import type { Account, Lock } from '@fishbot/utils/types/Account.model';
import type { User } from '@fishbot/utils/types/User.model';
import _ from 'lodash';
import moment from 'moment';

const isEqualLock = (lock1: Lock, lock2: Lock) => lock1.type === lock2.type
  && _.isEqual(lock1.value, lock2.value)
  && lock1.lockByUserId === lock2.lockByUserId
  && lock1.lockByUserName === lock2.lockByUserName
  && lock1.lockMessage === lock2.lockMessage;

const unlockHandler = async (lock: Lock, providerId: string, userId: string) => {
  await Mongo.collection<Account>('accounts').updateOne(
    {
      _id: providerId,
      'members.userId': userId,
    },
    {
      $pull: {
        'members.$.locks': {
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

const lockHandler = async (lock: Lock, providerId: string, userId: string) => {
  const msg = `Lock user ${providerId} ${userId}, ${JSON.stringify(lock)}`;
  Logger.warn(msg);
  send(msg, [], `p-${providerId}`);

  await Mongo.collection<Account>('accounts').updateOne(
    {
      _id: providerId,
      'members.userId': userId,
    },
    {
      $push: {
        'members.$.locks': lock,
      },
    },
  );
};

const lockMember = async ({ data, userInfo }: {
  data: {
    providerId: string,
    userId: string,
    lock: Lock,
    unlock?: boolean,
  }
  userInfo: User,
}) => {
  const {
    providerId, userId, lock, unlock,
  } = data;
  if (!providerId || !userId || !lock) {
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
      members: 1,
    },
  });
  if (!account?.members) {
    return { error: ErrorType.accountNotFound };
  }

  const { members } = account;
  const memberIndex = members.findIndex((item) => item.userId === userId);
  if (memberIndex === -1) {
    return { error: ErrorType.userNotFound };
  }

  const {
    locks = [],
  } = members[memberIndex] || {};

  const lockIndex = locks.findIndex((item) => isEqualLock(item, lock));
  if (lockIndex >= 0) {
    if (!unlock) {
      return { error: ErrorType.badRequest };
    }
    if (!(isAdminWeb || moment(lock.lockUntil) < moment())) {
      return { error: ErrorType.accessDenied };
    }

    await unlockHandler(lock, providerId, userId);

    return {
      result: {
        _id: providerId,
        members: [
          ...members.splice(memberIndex, 1),
          {
            ...members[memberIndex],
            locks: locks.splice(lockIndex, 1),
          },
        ],
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

  await lockHandler(lock, providerId, userId);

  return {
    result: {
      _id: providerId,
      members: [
        ...members.splice(memberIndex, 1),
        {
          ...members[memberIndex],
          locks: [...locks, lock],
        },
      ],
    },
  };
};

export default lockMember;
