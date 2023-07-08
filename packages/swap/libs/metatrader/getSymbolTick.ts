import getSymbolTickMetaTrader from '@fishprovider/metatrader/commands/getSymbolTick';
import type { Config as ConfigMetaTrader } from '@fishprovider/metatrader/types/Config.model';
import type { ProviderType } from '@fishprovider/utils/constants/account';
import type { Config } from '@fishprovider/utils/types/Account.model';

import { savePrice } from '~utils/price';

import connectAndRun from './connectAndRun';

const getSymbolTick = async (params: {
  providerType: ProviderType,
  symbol: string,
  config: Config,
}) => {
  const {
    providerType, symbol, config,
  } = params;

  const result = await connectAndRun({
    providerId: `${providerType}-${symbol}`,
    handler: async (connection) => {
      const { bid = 0, ask = 0 } = await getSymbolTickMetaTrader(connection, symbol);

      const bidPrice = +bid || +ask;
      const askPrice = +ask || +bid;
      const last = (bidPrice + askPrice) / 2;

      const price = {
        _id: `${providerType}-${symbol}`,
        last,
        time: Date.now(),
        bid: bidPrice || last,
        ask: askPrice || last,
      };

      await savePrice(providerType, symbol, price);

      return price;
    },
    config: config as ConfigMetaTrader,
  });

  return {
    ...result,
    updatedAt: new Date(),
  };
};

export default getSymbolTick;
