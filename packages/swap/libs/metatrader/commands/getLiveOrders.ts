import getPositions from '@fishprovider/metatrader/commands/getPositions';
import type { Config as ConfigMetaTrader } from '@fishprovider/metatrader/types/Config.model';
import type { ConnectionType } from '@fishprovider/metatrader/types/Connection.model';
import type { ProviderType } from '@fishprovider/utils/constants/account';
import type { Config } from '@fishprovider/utils/types/Account.model';
import type { RedisSymbol } from '@fishprovider/utils/types/Redis.model';
import type { AsyncReturnType } from 'type-fest';

import { getSymbols } from '~utils/price';

import connectAndRun from '../connectAndRun';
import { transformPosition } from '../transform';

const transformOrders = (
  res: AsyncReturnType<typeof getPositions>,
  providerId: string,
  providerType: ProviderType,
  symbolIds: Record<string, RedisSymbol>,
) => ({
  positions: res.map((item) => transformPosition(item, providerId, providerType, symbolIds)),
  providerData: res,
});

const getLiveOrders = async (params: {
  providerId: string,
  providerType: ProviderType,
  config?: Config,
  connection?: ConnectionType,
  accountId?: string,
}) => {
  const {
    providerId, providerType, config, connection, accountId,
  } = params;

  const { symbolIds } = await getSymbols(providerType);

  if (connection) {
    const result = await getPositions(connection, accountId);
    return transformOrders(result, providerId, providerType, symbolIds);
  }

  if (!config) {
    throw new Error('config not round');
  }

  const result = await connectAndRun({
    providerId,
    handler: async (conn) => {
      const res = await getPositions(conn);
      return res;
    },
    config: config as ConfigMetaTrader,
  });
  return transformOrders(result, providerId, providerType, symbolIds);
};

export default getLiveOrders;
