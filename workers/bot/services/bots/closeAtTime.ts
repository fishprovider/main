import { send } from '@fishprovider/old-core/dist/libs/notif';
import removePosition from '@fishprovider/swap/dist/commands/removePosition';
import { botUser } from '@fishprovider/swap/dist/utils/account';
import { isLastRunExpired } from '@fishprovider/utils/dist/helpers/lastRunChecks';
import type { Account } from '@fishprovider/utils/dist/types/Account.model';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import moment from 'moment';

const env = {
  dryRun: process.env.DRY_RUN,
};

const runs = {};

const checkCloseTimeReached = (account: Account, profit: number) => {
  const { enabledCloseTime, closeTime, closeTimeIfProfit } = account?.tradeSettings || {};
  if (!enabledCloseTime) return false;
  if (moment().isBefore(moment(closeTime))) return false;
  if (closeTimeIfProfit && profit < 0) return false;
  return true;
};

const closeAtTime = async (account: Account, liveOrders: Order[], profit: number) => {
  const { _id: providerId } = account;
  try {
    const isCloseTimeReached = checkCloseTimeReached(account, profit);
    if (!isCloseTimeReached) return;

    if (
      !isLastRunExpired({
        runs,
        runId: providerId,
        timeUnit: 'seconds',
        timeAmt: 60,
        checkIds: [`${isCloseTimeReached}`],
      })
    ) return;

    const msg = '[bot] Close time reached, close all orders';
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
          'tradeSettings.enabledCloseTime': '',
          'tradeSettings.closeTime': '',
          'tradeSettings.closeTimeIfProfit': '',
        },
      },
    );
  } catch (err) {
    Logger.error(`[bot] Failed to closeAtTime ${providerId}`, err);
  }
};

export default closeAtTime;
