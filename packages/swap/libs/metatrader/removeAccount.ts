import removeAccountMetaTrader from '@fishprovider/metatrader/commands/removeAccount';
import type { Config as ConfigMetaTrader } from '@fishprovider/metatrader/types/Config.model';
import type { Config } from '@fishprovider/utils/types/Account.model';

import connectAndRun from './connectAndRun';

const removeAccount = async (params: {
  providerId: string,
  config: Config,
}) => {
  const { providerId, config } = params;

  const result = await connectAndRun({
    providerId,
    handler: async (connection) => {
      const res = await removeAccountMetaTrader(connection);
      return res;
    },
    config: config as ConfigMetaTrader,
  });

  return {
    accountId: result.id,
    providerData: result,
    updatedAt: new Date(),
  };
};

export default removeAccount;
