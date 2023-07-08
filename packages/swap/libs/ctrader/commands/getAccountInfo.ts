import getAccountInformation from '@fishprovider/ctrader/commands/getAccountInformation';
import type { Config as ConfigCTrader } from '@fishprovider/ctrader/types/Config.model';
import type { ConnectionType } from '@fishprovider/ctrader/types/Connection.model';
import type { Config } from '@fishprovider/utils/types/Account.model';
import type { AsyncReturnType } from 'type-fest';

import connectAndRun from '../connectAndRun';

const transformAccountInfo = (res: AsyncReturnType<typeof getAccountInformation>) => ({
  providerPlatformAccountId: res.traderLogin || res.accountId,
  leverage: res.leverage || 0,
  balance: res.balance,
  assetId: res.assetId,
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
    config: config as ConfigCTrader,
  });
  return transformAccountInfo(result);
};

export default getAccountInfo;
