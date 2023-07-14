import { send } from '@fishprovider/core/dist/libs/notif';
import removeOrder from '@fishprovider/swap/dist/commands/removeOrder';
import removePosition from '@fishprovider/swap/dist/commands/removePosition';
import { botUser, getProvider } from '@fishprovider/swap/dist/utils/account';
import { getLiveOrders, getPendingOrders } from '@fishprovider/swap/dist/utils/order';
import { PlanType } from '@fishprovider/utils/dist/constants/account';
import { isLastRunExpired } from '@fishprovider/utils/dist/helpers/lastRunChecks';
import type { Account } from '@fishprovider/utils/dist/types/Account.model';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import _ from 'lodash';

import { LevelTarget, lockForBreak, lockTilMonthEnd } from '~utils/account';

interface EquityLock {
  target: number;
  hours?: number;
}

const env = {
  dryRun: process.env.DRY_RUN,
};

const runs = {};

const lockValues = {
  monthTarget: 'monthTarget',
  levelTarget: 'levelTarget',
  equityLock: 'equityLock',
};

const checkMonthTarget = (
  account: Account,
  liveOrders: Order[],
  equity: number,
  profitOffset: number,
) => {
  const {
    balance = 0,
    plan = [],
    locks = [],
  } = account;

  if (locks.some((lock) => lock.value === lockValues.monthTarget)) {
    return 0;
  }

  const monthTarget = plan.find((item) => item.type === PlanType.monthTargetLock)
    ?.value as number;
  if (!monthTarget) return 0;

  if (liveOrders.length) {
    const target = monthTarget + profitOffset;
    return equity > target ? monthTarget : 0;
  }

  return balance > monthTarget ? monthTarget : 0;
};

const checkLevelTarget = (
  account: Account,
  liveOrders: Order[],
  equity: number,
  profitOffset: number,
) => {
  const {
    balance = 0,
    activeLevelTarget = 0,
    plan = [],
    locks = [],
  } = account;

  if (locks.some((lock) => lock.value === lockValues.levelTarget)) {
    return null;
  }

  const levelTargets = plan.find((item) => item.type === PlanType.levelTargetsLock)
    ?.value as LevelTarget[];
  if (!levelTargets) return null;

  const levelTarget = levelTargets.find((item) => item.level === activeLevelTarget);
  if (!levelTarget) return null;

  if (liveOrders.length) {
    const target = levelTarget.target + profitOffset;
    return equity > target ? levelTarget : 0;
  }

  return balance > levelTarget.target ? levelTarget : null;
};

const checkEquityLock = (
  account: Account,
  liveOrders: Order[],
  equity: number,
  profitOffset: number,
) => {
  const {
    balance = 0,
    protectSettings = {},
    locks = [],
  } = account;

  if (locks.some((lock) => lock.value === lockValues.equityLock)) {
    return null;
  }

  const equityLock = protectSettings.enabledEquityLock && protectSettings.equityLock;
  if (!equityLock) return null;

  if (liveOrders.length) {
    const target = equityLock + profitOffset;
    return equity > target ? { target, hours: protectSettings.equityLockHours } : 0;
  }

  return balance > equityLock ? {
    target: equityLock,
    hours: protectSettings.equityLockHours,
  } : null;
};

const checkTargetReach = (account: Account, liveOrders: Order[], profit: number) => {
  const {
    balance = 0,
    plan = [],
  } = account;

  const profitOffset = (plan.find((item) => item.type === PlanType.profitOffset)
    ?.value as number) || 0;
  const equity = balance + profit;

  const monthTarget = checkMonthTarget(account, liveOrders, equity, profitOffset);
  if (monthTarget) {
    return { monthTarget };
  }

  const levelTarget = checkLevelTarget(account, liveOrders, equity, profitOffset);
  if (levelTarget) {
    return { levelTarget };
  }

  const equityLock = checkEquityLock(account, liveOrders, equity, profitOffset);
  if (equityLock) {
    return { equityLock };
  }

  return {};
};

const closeAndLock = async (
  account: Account,
  liveOrders: Order[],
  monthTarget?: number,
  levelTarget?: LevelTarget,
  equityLock?: EquityLock,
) => {
  const { _id: providerId, config } = account;

  for (const order of liveOrders) {
    await removePosition({ order, options: { config, ...botUser } })
      .catch((err) => {
        if (err.message.includes('POSITION_NOT_FOUND')) return;
        Logger.error(`[bot] Failed to remove order ${providerId} ${order._id} ${err.message}`);
      });
  }

  const pendingOrders = await getPendingOrders(providerId);
  for (const order of pendingOrders) {
    await removeOrder({ order, options: { config, ...botUser } })
      .catch((err) => {
        Logger.error(`[bot] Failed to remove order ${providerId} ${order._id} ${err.message}`);
      });
  }

  if (monthTarget) {
    await lockTilMonthEnd(
      providerId,
      lockValues.monthTarget,
      `🎉 Target Reached at ${monthTarget}`,
    );
    return;
  }

  if (levelTarget) {
    await lockForBreak(
      providerId,
      lockValues.levelTarget,
      `🎉 Target Reached at ${levelTarget.target} - Level ${levelTarget.level}`,
      24,
      account,
      {
        levelTarget: levelTarget.level,
      },
    );
    return;
  }

  if (equityLock) {
    await lockForBreak(
      providerId,
      lockValues.equityLock,
      `❌ Equity Locked at ${equityLock.target} - Time for meditation 🧘`,
      equityLock.hours || 12,
      account,
      {
        equityLock: true,
      },
    );
  }
};

const lockTarget = async (account: Account, liveOrders: Order[], profit: number) => {
  const { _id: providerId, providerGroupId } = account;
  try {
    const { monthTarget, levelTarget, equityLock } = checkTargetReach(account, liveOrders, profit);
    if (!(monthTarget || levelTarget || equityLock)) return;

    if (
      !isLastRunExpired({
        runs,
        runId: providerId,
        timeUnit: 'seconds',
        timeAmt: 60,
        checkIds: [`${monthTarget}-${levelTarget?.target}-${equityLock?.target}`],
      })
    ) return;

    const msg = '[bot] Target/Lock, close all orders and lock account';
    Logger.debug(`[${providerId}] ${msg}`);
    send(msg, [`${monthTarget}`, `${levelTarget?.target}`, `${equityLock?.target}`], `p-${providerId}`);

    if (env.dryRun) return;

    await closeAndLock(
      account,
      liveOrders,
      monthTarget,
      levelTarget,
      equityLock,
    );

    if (providerGroupId) {
      const groupAccConfigs = await Mongo.collection<Account>('accounts').find({
        _id: { $ne: providerId },
        providerGroupId,
      }, {
        projection: {
          config: 1,
        },
      }).toArray();
      for (const groupAccConfig of groupAccConfigs) {
        const [groupAccPublic, groupAccLiveOrders] = await Promise.all([
          getProvider(groupAccConfig._id),
          getLiveOrders(groupAccConfig._id),
        ]);
        await closeAndLock(
          {
            ...groupAccPublic,
            ...groupAccConfig,
          },
          groupAccLiveOrders,
          monthTarget,
          levelTarget,
          equityLock,
        );
      }
    }
  } catch (err) {
    Logger.error(`[bot] Failed to lockTarget ${providerId}`, err);
  }
};

export default lockTarget;
