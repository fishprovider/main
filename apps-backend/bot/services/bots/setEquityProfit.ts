import { send } from '@fishprovider/old-core/dist/libs/notif';
import { ProviderType } from '@fishprovider/utils/dist/constants/account';
import { isLastRunExpired } from '@fishprovider/utils/dist/helpers/lastRunChecks';
import type { Account } from '@fishprovider/utils/dist/types/Account.model';
import _ from 'lodash';

const env = {
  dryRun: process.env.DRY_RUN,
};

const runs = {};

const setEquityProfit = async (account: Account, profit: number) => {
  const {
    _id: providerId, providerType, balance = 0, equity: oldEquity = 0, profit: oldProfit = 0,
  } = account;
  try {
    if (providerType !== ProviderType.icmarkets) return;

    const equity = balance + profit;
    if (equity === oldEquity && profit === oldProfit) return;

    if (
      !isLastRunExpired({
        runs,
        runId: providerId,
        timeUnit: 'seconds',
        timeAmt: 10,
        checkIds: [providerId],
      })
    ) return;

    const msg = `[bot] Set equity ${equity}, profit ${profit}`;
    Logger.debug(`[${providerId}] ${msg}`);
    send(msg, [], `p-${providerId}`);

    if (env.dryRun) return;

    await Mongo.collection<Account>('accounts').updateOne(
      { _id: providerId },
      {
        $set: {
          equity,
          profit,
        },
      },
    );

    _.set(account, 'equity', equity);
    _.set(account, 'profit', profit);
  } catch (err) {
    Logger.error(`[bot] Failed to setEquityProfit ${providerId}`, err);
  }
};

export default setEquityProfit;
