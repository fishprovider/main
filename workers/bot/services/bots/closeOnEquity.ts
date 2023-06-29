import { send } from '@fishbot/core/libs/notif';
import removePosition from '@fishbot/swap/commands/removePosition';
import { botUser } from '@fishbot/swap/utils/account';
import { isLastRunExpired } from '@fishbot/utils/helpers/lastRunChecks';
import type { Account } from '@fishbot/utils/types/Account.model';
import type { Order } from '@fishbot/utils/types/Order.model';

const env = {
  dryRun: process.env.DRY_RUN,
};

const runs = {};

const checkCloseEquityReached = (account: Account, profit: number) => {
  const { enabledCloseEquity, targetEquity, stopEquity } = account?.tradeSettings || {};
  if (!enabledCloseEquity) return false;

  const {
    balance = 0,
  } = account;

  const equity = balance + profit;
  if (targetEquity && equity >= targetEquity) return true;
  if (stopEquity && equity <= stopEquity) return true;
  return false;
};

const closeOnEquity = async (account: Account, liveOrders: Order[], profit: number) => {
  const { _id: providerId } = account;
  try {
    const isCloseEquityReached = checkCloseEquityReached(account, profit);
    if (!isCloseEquityReached) return;

    if (
      !isLastRunExpired({
        runs,
        runId: providerId,
        timeUnit: 'seconds',
        timeAmt: 60,
        checkIds: [`${isCloseEquityReached}`],
      })
    ) return;

    const msg = '[bot] Close equity reached, close all orders';
    Logger.debug(`[${providerId}] ${msg}`, liveOrders);
    send(msg, [], `p-${providerId}`);

    if (env.dryRun) return;

    for (const order of liveOrders) {
      await removePosition({ order, options: { config: account.config, ...botUser } })
        .catch((err) => {
          if (err.message.includes('POSITION_NOT_FOUND')) return;
          Logger.error(`[bot] Failed to remove order ${providerId} ${order._id} ${err.message}`);
        });
    }

    await Mongo.collection<Account>('accounts').updateOne(
      { _id: providerId },
      {
        $unset: {
          'tradeSettings.enabledCloseEquity': '',
        },
      },
    );
  } catch (err) {
    Logger.error(`[bot] Failed to closeOnEquity ${providerId}`, err);
  }
};

export default closeOnEquity;
