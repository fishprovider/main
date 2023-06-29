import { send } from '@fishbot/core/libs/notif';
import removeOrder from '@fishbot/swap/commands/removeOrder';
import removePosition from '@fishbot/swap/commands/removePosition';
import { botUser } from '@fishbot/swap/utils/account';
import { getPendingOrders } from '@fishbot/swap/utils/order';
import { LockType, PlanType } from '@fishbot/utils/constants/account';
import { isLastRunExpired } from '@fishbot/utils/helpers/lastRunChecks';
import { getProfit } from '@fishbot/utils/helpers/order';
import type { Account } from '@fishbot/utils/types/Account.model';
import type { Order } from '@fishbot/utils/types/Order.model';
import _ from 'lodash';
import moment from 'moment';

import { lockPairs } from '~utils/account';

const env = {
  dryRun: process.env.DRY_RUN,
};

const runs = {};

const checkLostSeriesPair = (account: Account, todayOrders: Order[]) => {
  const {
    plan = [],
    locks = [],
    asset = 'USD',
  } = account;

  const maxLostSeriesPair = plan.find((item) => item.type === PlanType.lostSeriesPairLock)
    ?.value as number;
  if (!maxLostSeriesPair) return [];

  const lockedPairs: Record<string, boolean> = {};
  locks.forEach((item) => {
    if (item.type === LockType.pairs && item.value) {
      (item.value as string[]).forEach((pair) => {
        lockedPairs[pair] = true;
      });
    }
  });

  const profitPairs: Record<string, number> = {};
  const lastCheck = moment().subtract(12, 'hours');
  todayOrders.forEach((order) => {
    if (lockedPairs[order.symbol]) return;
    if (moment(order.createdAt) < lastCheck) return;

    if (!profitPairs[order.symbol]) {
      profitPairs[order.symbol] = 0;
    }
    profitPairs[order.symbol] += getProfit([order], {}, asset);
  });

  const lostSeriesPairs = Object.keys(profitPairs).filter((symbol) => {
    const profit = (profitPairs[symbol] || 0);
    return profit <= maxLostSeriesPair;
  });

  return lostSeriesPairs;
};

const lockLostSeriesPair = async (account: Account, todayOrders: Order[], liveOrders: Order[]) => {
  const {
    _id: providerId, config,
  } = account;
  try {
    const lostSeriesPairs = checkLostSeriesPair(account, todayOrders);
    if (!lostSeriesPairs.length) return;

    if (
      !isLastRunExpired({
        runs,
        runId: providerId,
        timeUnit: 'seconds',
        timeAmt: 60,
        checkIds: lostSeriesPairs,
      })
    ) return;

    const msg = `[bot] Lost series pair happened, close all orders ${lostSeriesPairs.join(', ')}`;
    Logger.debug(`[${providerId}] ${msg}`);
    send(msg, [], `p-${providerId}`);

    if (env.dryRun) return;

    for (const order of liveOrders.filter((item) => lostSeriesPairs.includes(item.symbol))) {
      await removePosition({ order, options: { config, ...botUser } })
        .catch((err) => {
          if (err.message.includes('POSITION_NOT_FOUND')) return;
          Logger.error(`[bot] Failed to remove order ${providerId} ${order._id} ${err.message}`);
        });
    }

    const pendingOrders = await getPendingOrders(providerId);
    for (const order of pendingOrders.filter((item) => lostSeriesPairs.includes(item.symbol))) {
      await removeOrder({ order, options: { config, ...botUser } })
        .catch((err) => {
          Logger.error(`[bot] Failed to remove order ${providerId} ${order._id} ${err.message}`);
        });
    }

    await lockPairs(providerId, lostSeriesPairs, 'Lost pair series - Time for meditation 🧘');
  } catch (err) {
    Logger.error(`[bot] Failed to lockLostSeriesPair ${providerId}`, err);
  }
};

export default lockLostSeriesPair;
