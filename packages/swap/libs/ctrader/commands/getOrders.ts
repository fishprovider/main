import getAllPositionsAndOrders from '@fishprovider/ctrader/commands/getAllPositionsAndOrders';
import type { Config as ConfigCTrader } from '@fishprovider/ctrader/types/Config.model';
import type { ConnectionType } from '@fishprovider/ctrader/types/Connection.model';
import type { ProviderType } from '@fishprovider/utils/constants/account';
import { OrderStatus } from '@fishprovider/utils/constants/order';
import type { Config } from '@fishprovider/utils/types/Account.model';
import type { RedisSymbol } from '@fishprovider/utils/types/Redis.model';
import type { AsyncReturnType } from 'type-fest';

import { getSymbols } from '~utils/price';

import connectAndRun from '../connectAndRun';
import { transformOrder, transformPosition } from '../transform';

const transformOrders = (
  res: AsyncReturnType<typeof getAllPositionsAndOrders>,
  providerId: string,
  providerType: ProviderType,
  symbolIds: Record<string, RedisSymbol>,
) => ({
  orders: res.orders.map((item) => ({
    ...transformOrder(item, providerId, providerType, symbolIds),
    status: OrderStatus.pending,
  })),
  positions: res.positions.map((item) => ({
    ...transformPosition(item, providerId, providerType, symbolIds),
    status: OrderStatus.live,
  })),
  providerData: res,
  updatedAt: new Date(),
});

const getOrders = async (params: {
  providerId: string,
  providerType: ProviderType,
  config?: Config,
  connection?: ConnectionType,
  accountId?: string,
  updateClosedOrders?: boolean,
}) => {
  const {
    providerId, providerType, config, connection, accountId,
    updateClosedOrders,
  } = params;

  const { symbolIds } = await getSymbols(providerType);

  if (connection) {
    const result = await getAllPositionsAndOrders(connection, accountId);
    return {
      ...transformOrders(result, providerId, providerType, symbolIds),
      updateClosedOrders,
    };
  }

  if (!config) {
    throw new Error('config not round');
  }

  const result = await connectAndRun({
    providerId,
    handler: async (conn) => {
      const res = await getAllPositionsAndOrders(conn);
      return res;
    },
    config: config as ConfigCTrader,
  });
  return {
    ...transformOrders(result, providerId, providerType, symbolIds),
    updateClosedOrders,
  };
};

export default getOrders;
