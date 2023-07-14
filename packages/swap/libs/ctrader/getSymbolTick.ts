import getTickData from '@fishprovider/ctrader/dist/commands/getTickData';
import type { QuoteType } from '@fishprovider/ctrader/dist/constants/openApi';
import type { Config as ConfigCTrader } from '@fishprovider/ctrader/dist/types/Config.model';
import type { ConnectionType } from '@fishprovider/ctrader/dist/types/Connection.model';
import type { ProviderType } from '@fishprovider/utils/dist/constants/account';
import type { Config } from '@fishprovider/utils/dist/types/Account.model';
import _ from 'lodash';

import type { SymbolCTrader } from '~types/Symbol.model';

import connectAndRun from './connectAndRun';

const getSymbolTick = async (params: {
  providerType: ProviderType,
  config?: Config,
  connection?: ConnectionType,
  symbol: SymbolCTrader,
  quoteType: QuoteType,
  fromTimestamp: number,
  toTimestamp: number,
}) => {
  const {
    providerType, config, connection, symbol: symbolObj, quoteType, fromTimestamp, toTimestamp,
  } = params;

  const { symbol, symbolId } = symbolObj;

  if (connection) {
    const result = await getTickData(
      connection,
      symbolId,
      quoteType,
      fromTimestamp,
      toTimestamp,
    );
    return result;
  }

  if (!config) {
    throw new Error('config not round');
  }

  const result = await connectAndRun({
    providerId: `${providerType}-${symbol}`,
    handler: async (conn) => {
      const res = await getTickData(
        conn,
        symbolId,
        quoteType,
        fromTimestamp,
        toTimestamp,
      );
      return res;
    },
    config: config as ConfigCTrader,
  });

  return {
    ...result,
    updatedAt: new Date(),
  };
};

export default getSymbolTick;
