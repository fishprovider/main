import { send } from '@fishprovider/core/libs/notif';
import { isLastRunExpired } from '@fishprovider/utils/helpers/lastRunChecks';
import type { Account } from '@fishprovider/utils/types/Account.model';
import _ from 'lodash';
import moment from 'moment';

const env = {
  dryRun: process.env.DRY_RUN,
};

const runs = {};

const getNewMaxEquity = (
  account: Account,
  profit: number,
) => {
  const {
    balance = 0,
    maxEquity = balance,
    maxEquityTime,
  } = account;
  const equity = balance + profit;

  if (!maxEquity || !maxEquityTime) return equity;

  const isNewDay = moment.utc().day() !== moment.utc(maxEquityTime).day();
  if (isNewDay) return equity;

  if (equity > maxEquity) return equity;

  return 0;
};

const setMaxEquity = async (
  account: Account,
  profit: number,
) => {
  const {
    _id: providerId,
    balance = 0,
    maxEquity = balance,
  } = account;
  try {
    const newMaxEquity = getNewMaxEquity(account, profit);
    if (!newMaxEquity) return;

    if (
      !isLastRunExpired({
        runs,
        runId: providerId,
        timeUnit: 'seconds',
        timeAmt: 60,
        checkIds: [`${newMaxEquity}`],
      })
    ) return;

    const msg = `[bot] Set max equity from ${maxEquity} to ${newMaxEquity}`;
    Logger.debug(`[${providerId}] ${msg}`);
    const diff = (Math.abs(newMaxEquity - maxEquity) * 100) / maxEquity;
    if (diff > 5) {
      send(msg, [], `p-${providerId}`);
    }

    if (env.dryRun) return;

    const maxEquityTime = new Date();
    await Mongo.collection<Account>('accounts').updateOne(
      { _id: providerId },
      {
        $set: {
          maxEquity: newMaxEquity,
          maxEquityTime,
        },
      },
    );

    _.set(account, 'maxEquity', newMaxEquity);
    _.set(account, 'maxEquityTime', maxEquityTime);
  } catch (err) {
    Logger.error(`[bot] Failed to setMaxEquity ${providerId}`, err);
  }
};

export default setMaxEquity;
