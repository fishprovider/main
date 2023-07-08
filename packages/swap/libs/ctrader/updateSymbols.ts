import getSymbolDetail from '@fishprovider/ctrader/commands/getSymbolDetail';
import type { Config as ConfigCTrader } from '@fishprovider/ctrader/types/Config.model';
import type { ProviderType } from '@fishprovider/utils/constants/account';
import delay from '@fishprovider/utils/helpers/delay';
import type { Config } from '@fishprovider/utils/types/Account.model';
import type { Price } from '@fishprovider/utils/types/Price.model';
import _ from 'lodash';

import type { SymbolCTrader } from '~types/Symbol.model';
import { getAssets, saveSymbols } from '~utils/price';

import connectAndRun from './connectAndRun';

const updateSymbols = async (params: {
  providerId: string,
  providerType: ProviderType,
  config: Config,
  allSymbols: SymbolCTrader[],
}) => {
  const {
    providerId, providerType, config, allSymbols,
  } = params;

  await connectAndRun({
    providerId,
    handler: async (connection) => {
      const { assetIds } = await getAssets(providerType);

      Logger.info(`Updating ${allSymbols.length} symbols`);
      const symbols: Omit<Price, 'last'>[] = [];
      for (const {
        symbol, symbolId, baseAssetId, quoteAssetId,
      } of allSymbols) {
        const { symbols: details } = await getSymbolDetail(connection, [+symbolId]);
        const detail = details[0];

        const doc = {
          _id: `${providerType}-${symbol}`,
          providerType,
          symbol,
          symbolId,
          baseAsset: assetIds[baseAssetId] || '',
          quoteAsset: assetIds[quoteAssetId] || '',
          lotSize: detail?.lotSize || 0,
          pipSize: detail?.pipSize || 0,
          digits: detail?.digits || 0,
          minVolume: detail?.minVolume || 0,
          maxVolume: detail?.maxVolume || 0,
          providerData: {
            ...detail,
            details: _.tail(details),
          },
        };

        symbols.push(doc);

        await delay(500);
      }
      Logger.debug(`Saving ${symbols.length} symbols`, symbols);
      await saveSymbols(providerType, symbols);
      Logger.info(`Updated ${symbols.length} symbols`);
    },
    config: config as ConfigCTrader,
  });
};

export default updateSymbols;
