import getAccountList from '@fishbot/ctrader/commands/getAccountList';
import type { Config as ConfigCTrader } from '@fishbot/ctrader/types/Config.model';
import type { Config } from '@fishbot/utils/types/Account.model';

import connectAndRun from './connectAndRun';

const getAccounts = async (params: {
  providerId: string,
  config: Config,
}) => {
  const { providerId, config } = params;

  const result = await connectAndRun({
    providerId,
    handler: async (connection) => {
      const res = await getAccountList(connection);
      return res;
    },
    config: config as ConfigCTrader,
  });
  return {
    accounts: result.accounts,
    providerData: result,
    updatedAt: new Date(),
  };
};

export default getAccounts;
