import getDealsMetaTrader from '@fishprovider/metatrader/commands/getDeals';
import type { Config as ConfigMetaTrader } from '@fishprovider/metatrader/types/Config.model';
import type { ConnectionType } from '@fishprovider/metatrader/types/Connection.model';
import type { ProviderType } from '@fishprovider/utils/constants/account';
import { OrderStatus } from '@fishprovider/utils/constants/order';
import type { Config } from '@fishprovider/utils/types/Account.model';
import type { RedisSymbol } from '@fishprovider/utils/types/Redis.model';
import moment from 'moment';
import type { AsyncReturnType } from 'type-fest';

import { getSymbols } from '~utils/price';

import connectAndRun from '../connectAndRun';
import { transformDeal } from '../transform';

const transformDeals = (
  res: AsyncReturnType<typeof getDealsMetaTrader>,
  providerId: string,
  providerType: ProviderType,
  symbolIds: Record<string, RedisSymbol>,
) => ({
  deals: res
    .map((item) => ({
      ...transformDeal(item, providerId, providerType, symbolIds),
      status: OrderStatus.closed,
    }))
    .filter((item) => (
      !!item.orderType // only for deal of order
      && !!item.volumeClose
    )),
  providerData: res,
  updatedAt: new Date(),
});

const getDeals = async (params: {
  providerId: string,
  providerType: ProviderType,
  config?: Config,
  connection?: ConnectionType,
  accountId?: string,
  weeks?: number,
  days?: number,
  from?: number,
  to?: number,
}) => {
  const {
    providerId, providerType, config, connection, accountId,
    weeks = 0,
    days = 0,
    from = 0,
    to = 0,
  } = params;

  if (!(weeks || days || (from && to))) {
    throw new Error('weeks, days or from/to must be provided');
  }

  const { symbolIds } = await getSymbols(providerType);

  const now = moment();
  let fromTime = new Date(from).toISOString();
  let toTime = new Date(to).toISOString();
  if (days) {
    toTime = now.subtract(days - 1, 'days').toISOString(); // now is mutated
    fromTime = now.subtract(1, 'days').toISOString();
  } else if (weeks) {
    toTime = now.subtract(weeks - 1, 'weeks').toISOString(); // now is mutated
    fromTime = now.subtract(1, 'weeks').toISOString();
  }

  if (connection) {
    const result = await getDealsMetaTrader(connection, fromTime, toTime, accountId);
    return {
      ...transformDeals(result, providerId, providerType, symbolIds),
      weeks,
      days,
      from,
      to,
    };
  }

  if (!config) {
    throw new Error('config not round');
  }

  const result = await connectAndRun({
    providerId,
    handler: async (conn) => {
      const res = await getDealsMetaTrader(conn, fromTime, toTime);
      return res;
    },
    config: config as ConfigMetaTrader,
  });
  return {
    ...transformDeals(result, providerId, providerType, symbolIds),
    weeks,
    days,
    from,
    to,
  };
};

export default getDeals;
