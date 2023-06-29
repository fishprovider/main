import { getProvider } from '@fishbot/swap/utils/account';
import { LockType, PlanType } from '@fishbot/utils/constants/account';
import type { Account } from '@fishbot/utils/types/Account.model';
import moment from 'moment';

const env = {
  botTasks: process.env.BOT_TASKS || 'account,locks,orders',
};

const botTasks: Record<string, boolean> = {};
env.botTasks.split(',').forEach((task) => {
  botTasks[task] = true;
});

interface LevelTarget {
  level: number,
  target: number,
  resetOnPass: boolean
}

const getAccount = async (providerId: string) => {
  const account = await getProvider(providerId);
  if (!account) {
    Logger.warn(`Account not found ${providerId}`);
  }
  return account;
};

const lockTilMonthEnd = async (providerId: string, lockValue: string, lockMessage: string) => {
  await Mongo.collection<Account>('accounts').updateOne(
    {
      _id: providerId,
    },
    {
      $push: {
        locks: {
          type: LockType.open,
          value: lockValue,
          lockFrom: new Date(),
          lockUntil: moment.utc().add(1, 'M').startOf('month').toDate(),
          lockMessage,
          lockByUserId: 'bot',
          lockByUserName: 'Bot',
        },
      },
    },
  );
};

const lockTilDayEnd = async (providerId: string, lockValue: string, lockMessage: string) => {
  await Mongo.collection<Account>('accounts').updateOne(
    {
      _id: providerId,
    },
    {
      $push: {
        locks: {
          type: LockType.open,
          value: lockValue,
          lockFrom: new Date(),
          lockUntil: moment.utc().add(1, 'd').startOf('d').toDate(),
          lockMessage,
          lockByUserId: 'bot',
          lockByUserName: 'Bot',
        },
      },
    },
  );
};

const lockPairs = async (providerId: string, pairsToLock: string[], lockMessage: string) => {
  await Mongo.collection<Account>('accounts').updateOne(
    {
      _id: providerId,
    },
    {
      $push: {
        locks: {
          type: LockType.pairs,
          value: pairsToLock,
          lockFrom: new Date(),
          lockUntil: moment().add(12, 'hours').toDate(),
          lockMessage,
          lockByUserId: 'bot',
          lockByUserName: 'Bot',
        },
      },
    },
  );
};

const getNextLevelTarget = (account: Account, level: number) => {
  const {
    plan = [],
  } = account;

  const levelTargets = plan.find((item) => item.type === PlanType.levelTargetsLock)
    ?.value as LevelTarget[];
  if (!levelTargets) return undefined;

  return levelTargets.find((item) => item.level === level + 1);
};

const lockForBreak = async (
  providerId: string,
  lockValue: string,
  lockMessage: string,
  lockHours: number,
  account: Account,
  options: {
    equityLock?: boolean,
    levelTarget?: number,
  } = {},
) => {
  const nextLevelTarget = options.levelTarget && getNextLevelTarget(account, options.levelTarget);

  await Mongo.collection<Account>('accounts').updateOne(
    {
      _id: providerId,
    },
    {
      $push: {
        locks: {
          type: LockType.open,
          value: lockValue,
          lockFrom: new Date(),
          lockUntil: moment().add(lockHours, 'hours').toDate(),
          lockMessage,
          lockByUserId: 'bot',
          lockByUserName: 'Bot',
        },
      },
      $unset: {
        ...(options.equityLock && {
          'protectSettings.enabledEquityLock': '',
        }),
        ...(options.levelTarget && !nextLevelTarget && {
          activeLevelTarget: '',
        }),
      },
      $set: {
        ...(options.levelTarget && nextLevelTarget && {
          activeLevelTarget: nextLevelTarget.level,
        }),
      },
    },
  );
};

export {
  botTasks,
  getAccount,
  lockForBreak,
  lockPairs,
  lockTilDayEnd,
  lockTilMonthEnd,
};

export type {
  LevelTarget,
};
