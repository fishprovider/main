import { send } from '@fishprovider/core/libs/notif';
import removePosition from '@fishprovider/swap/commands/removePosition';
import { botUser } from '@fishprovider/swap/utils/account';
import { isLastRunExpired } from '@fishprovider/utils/helpers/lastRunChecks';
import type { Account } from '@fishprovider/utils/types/Account.model';
import type { Order } from '@fishprovider/utils/types/Order.model';

const env = {
  dryRun: process.env.DRY_RUN,
};

const runs = {};

const checkCloseProfitReached = (account: Account, profit: number) => {
  const { enabledCloseProfit, takeProfit, stopLoss } = account?.tradeSettings || {};
  if (!enabledCloseProfit) return false;

  if (takeProfit && profit >= takeProfit) return true;
  if (stopLoss && profit <= stopLoss) return true;
  return false;
};

const closeOnProfit = async (account: Account, liveOrders: Order[], profit: number) => {
  const { _id: providerId } = account;
  try {
    const isCloseProfitReached = checkCloseProfitReached(account, profit);
    if (!isCloseProfitReached) return;

    if (
      !isLastRunExpired({
        runs,
        runId: providerId,
        timeUnit: 'seconds',
        timeAmt: 60,
        checkIds: [`${isCloseProfitReached}`],
      })
    ) return;

    const msg = '[bot] Close profit reached, close all orders';
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
          'tradeSettings.enabledCloseProfit': '',
        },
      },
    );
  } catch (err) {
    Logger.error(`[bot] Failed to closeOnProfit ${providerId}`, err);
  }
};

export default closeOnProfit;
