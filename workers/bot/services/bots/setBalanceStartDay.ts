// import { send } from '@fishprovider/core/dist/libs/notif';
import { isLastRunExpired } from '@fishprovider/utils/dist/helpers/lastRunChecks';
import type { Account } from '@fishprovider/utils/dist/types/Account.model';
import _ from 'lodash';
import moment from 'moment';

const env = {
  dryRun: process.env.DRY_RUN,
};

const runs = {};

const getNewBalanceStartDay = (
  account: Account,
) => {
  const {
    balance = 0,
    balanceStartDay,
    balanceStartDayUpdatedAt,
  } = account;

  if (!balanceStartDay || !balanceStartDayUpdatedAt) return balance;

  const isNewDay = moment.utc().day() !== moment.utc(balanceStartDayUpdatedAt).day();
  if (isNewDay) return balance;

  return 0;
};

const setBalanceStartDay = async (account: Account) => {
  const {
    _id: providerId,
    balance = 0,
    balanceStartDay = balance,
  } = account;
  try {
    const newBalanceStartDay = getNewBalanceStartDay(account);
    if (!newBalanceStartDay) return;

    if (
      !isLastRunExpired({
        runs,
        runId: providerId,
        timeUnit: 'seconds',
        timeAmt: 60,
        checkIds: [`${newBalanceStartDay}`],
      })
    ) return;

    const msg = `[bot] Set balanceStartDay from ${balanceStartDay} to ${newBalanceStartDay}`;
    Logger.debug(`[${providerId}] ${msg}`);
    // send(msg, [], `p-${providerId}`);

    if (env.dryRun) return;

    const balanceStartDayUpdatedAt = new Date();
    await Mongo.collection<Account>('accounts').updateOne(
      { _id: providerId },
      {
        $set: {
          balanceStartDay: newBalanceStartDay,
          balanceStartDayUpdatedAt,
        },
      },
    );

    _.set(account, 'balanceStartDay', newBalanceStartDay);
    _.set(account, 'balanceStartDayUpdatedAt', balanceStartDayUpdatedAt);
  } catch (err) {
    Logger.error(`[bot] Failed to setBalanceStartDay ${providerId}`, err);
  }
};

export default setBalanceStartDay;
