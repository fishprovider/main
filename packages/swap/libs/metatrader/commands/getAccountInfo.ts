import getAccountInformation from '@fishprovider/metatrader/dist/commands/getAccountInformation';
import type { Config as ConfigMetaTrader } from '@fishprovider/metatrader/dist/types/Config.model';
import type { ConnectionType } from '@fishprovider/metatrader/dist/types/Connection.model';
import type { Config } from '@fishprovider/utils/dist/types/Account.model';
import type { AsyncReturnType } from 'type-fest';

import connectAndRun from '../connectAndRun';

const transformAccountInfo = (res: AsyncReturnType<typeof getAccountInformation>) => ({
  providerPlatformAccountId: `${res.login}`,
  leverage: res.leverage,
  balance: res.balance,
  margin: res.margin,
  asset: res.currency,
  providerData: res,
  updatedAt: new Date(),
});

const getAccountInfo = async (params: {
  providerId: string,
  config?: Config,
  connection?: ConnectionType,
  accountId?: string,
}) => {
  const {
    providerId, config, connection, accountId,
  } = params;

  if (connection) {
    const result = await getAccountInformation(connection, accountId);
    return transformAccountInfo(result);
  }

  if (!config) {
    throw new Error('config not round');
  }

  const result = await connectAndRun({
    providerId,
    handler: async (conn) => {
      const res = await getAccountInformation(conn);
      return res;
    },
    config: config as ConfigMetaTrader,
  });
  return transformAccountInfo(result);
};

export default getAccountInfo;
