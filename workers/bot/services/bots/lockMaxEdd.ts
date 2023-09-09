import { send } from '@fishprovider/old-core/dist/libs/notif';
import removeOrder from '@fishprovider/swap/dist/commands/removeOrder';
import removePosition from '@fishprovider/swap/dist/commands/removePosition';
import { botUser } from '@fishprovider/swap/dist/utils/account';
import { getPendingOrders } from '@fishprovider/swap/dist/utils/order';
import { PlanType } from '@fishprovider/utils/dist/constants/account';
import { isLastRunExpired } from '@fishprovider/utils/dist/helpers/lastRunChecks';
import type { Account } from '@fishprovider/utils/dist/types/Account.model';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';

import { lockTilDayEnd } from '~utils/account';

const env = {
  dryRun: process.env.DRY_RUN,
};

const runs = {};

const lockValue = 'edd';

const checkMaxEdd = (account: Account, profit: number) => {
  const {
    balance = 0,
    maxEquity = balance,
    plan = [],
    locks = [],
  } = account;

  if (locks.some((lock) => lock.value === lockValue)) {
    return false;
  }

  const dayMaxEdd = (plan.find((item) => item.type === PlanType.dayMaxEddLock)
    ?.value as number) || 0;
  if (!dayMaxEdd) return false;

  const minEquity = maxEquity + dayMaxEdd;
  return balance + profit < minEquity;
};

const lockMaxEdd = async (
  account: Account,
  liveOrders: Order[],
  profit: number,
) => {
  const { _id: providerId, config } = account;
  try {
    const isMaxEdd = checkMaxEdd(account, profit);
    if (!isMaxEdd) return;

    if (
      !isLastRunExpired({
        runs,
        runId: providerId,
        timeUnit: 'seconds',
        timeAmt: 60,
        checkIds: [`${isMaxEdd}`],
      })
    ) return;

    const msg = '[bot] Max edd reached, close all orders and lock account';
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

    await lockTilDayEnd(providerId, lockValue, 'Max EDD - Time for meditation 🧘');
    await Mongo.collection<Account>('accounts').updateOne(
      { _id: providerId },
      {
        $unset: {
          maxEquity: '',
          maxEquityTime: '',
        },
      },
    );
  } catch (err) {
    Logger.error(`[bot] Failed to lockMaxEdd ${providerId}`, err);
  }
};

export default lockMaxEdd;
