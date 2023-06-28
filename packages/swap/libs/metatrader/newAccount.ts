import newAccountMetaTrader from '@fishbot/metatrader/commands/newAccount';
import type { Config as ConfigMetaTrader } from '@fishbot/metatrader/types/Config.model';
import type { Config } from '@fishbot/utils/types/Account.model';

import connectAndRun from './connectAndRun';

const newAccount = async (params: {
  providerId: string,
  config: Config,
  options: {
    name: string,
    platform?: string,
    login?: string,
    password?: string,
    server?: string,
  },
}) => {
  const { providerId, options, config } = params;

  const result = await connectAndRun({
    providerId,
    handler: async (connection) => {
      const res = await newAccountMetaTrader(connection, options);
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

export default newAccount;
