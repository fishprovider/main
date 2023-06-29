import { send } from '@fishbot/core/libs/notif';
import { isLastRunExpired } from '@fishbot/utils/helpers/lastRunChecks';
import type { Account } from '@fishbot/utils/types/Account.model';
import _ from 'lodash';

const env = {
  dryRun: process.env.DRY_RUN,
};

const runs = {};

const getNewEdd = (account: Account, profit: number) => {
  if (profit >= 0) return 0;

  const {
    balance = 0,
    edd = 0,
  } = account;

  const newEdd = Math.round((100 * -profit) / balance);
  if (newEdd <= edd) return 0;

  return newEdd;
};

const setEdd = async (account: Account, profit: number) => {
  const { _id: providerId, edd } = account;
  try {
    const newEdd = getNewEdd(account, profit);
    if (!newEdd) return;

    if (
      !isLastRunExpired({
        runs,
        runId: providerId,
        timeUnit: 'seconds',
        timeAmt: 60,
        checkIds: [`${newEdd}`],
      })
    ) return;

    const msg = `[bot] Set edd from ${edd} to ${newEdd}`;
    Logger.debug(`[${providerId}] ${msg}`);
    send(msg, [], `p-${providerId}`);

    if (env.dryRun) return;

    await Mongo.collection<Account>('accounts').updateOne(
      { _id: providerId },
      {
        $set: {
          edd: newEdd,
        },
      },
    );

    _.set(account, 'edd', newEdd);
  } catch (err) {
    Logger.error(`[bot] Failed to setEdd ${providerId}`, err);
  }
};

export default setEdd;
