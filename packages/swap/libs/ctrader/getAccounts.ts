import getAccountList from '@fishprovider/ctrader/commands/getAccountList';
import type { Config as ConfigCTrader } from '@fishprovider/ctrader/types/Config.model';
import type { Config } from '@fishprovider/utils/types/Account.model';

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
