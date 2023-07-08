import { send } from '@fishprovider/core/libs/notif';
import removeOrder from '@fishprovider/swap/commands/removeOrder';
import removePosition from '@fishprovider/swap/commands/removePosition';
import { botUser } from '@fishprovider/swap/utils/account';
import { getPendingOrders } from '@fishprovider/swap/utils/order';
import { PlanType } from '@fishprovider/utils/constants/account';
import { isLastRunExpired } from '@fishprovider/utils/helpers/lastRunChecks';
import { getProfit } from '@fishprovider/utils/helpers/order';
import type { Account } from '@fishprovider/utils/types/Account.model';
import type { Order } from '@fishprovider/utils/types/Order.model';
import _ from 'lodash';

import { lockTilDayEnd } from '~utils/account';

const env = {
  dryRun: process.env.DRY_RUN,
};

const runs = {};

const lockValue = 'bdd';

const checkMaxBdd = (account: Account, todayOrders: Order[], profit: number) => {
  const {
    plan = [],
    locks = [],
    asset = 'USD',
  } = account;

  if (locks.some((lock) => lock.value === lockValue)) {
    return false;
  }

  const dayMaxBdd = (plan.find((item) => item.type === PlanType.dayMaxBddLock)
    ?.value as number) || 0;
  if (!dayMaxBdd) return false;

  const todayProfit = getProfit(todayOrders, {}, asset);
  return (todayProfit + profit) < dayMaxBdd;
};

const lockMaxBdd = async (
  account: Account,
  todayOrders: Order[],
  liveOrders: Order[],
  profit: number,
) => {
  const { _id: providerId, config } = account;
  try {
    const isMaxBdd = checkMaxBdd(account, todayOrders, profit);
    if (!isMaxBdd) return;

    if (
      !isLastRunExpired({
        runs,
        runId: providerId,
        timeUnit: 'seconds',
        timeAmt: 60,
        checkIds: [`${isMaxBdd}`],
      })
    ) return;

    const msg = '[bot] Max bdd reached, close all orders and lock account';
    Logger.debug(`[${providerId}] ${msg}`);
    send(msg, [], `p-${providerId}`);

    if (env.dryRun) return;

    for (const order of liveOrders) {
      if (!(order.copyId || order.label?.startsWith('copy-') || order.comment?.startsWith('copy-'))) {
        await removePosition({ order, options: { config, ...botUser } })
          .catch((err) => {
            if (err.message.includes('POSITION_NOT_FOUND')) return;
            Logger.error(`[bot] Failed to remove order ${providerId} ${order._id} ${err.message}`);
          });
      }
    }

    const pendingOrders = await getPendingOrders(providerId);
    for (const order of pendingOrders) {
      await removeOrder({ order, options: { config, ...botUser } })
        .catch((err) => {
          Logger.error(`[bot] Failed to remove order ${providerId} ${order._id} ${err.message}`);
        });
    }

    await lockTilDayEnd(providerId, lockValue, 'Max BDD - Time for meditation 🧘');
  } catch (err) {
    Logger.error(`[bot] Failed to lockMaxBdd ${providerId}`, err);
  }
};

export default lockMaxBdd;
