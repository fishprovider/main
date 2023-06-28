import getSymbolDetail from '@fishbot/metatrader/commands/getSymbolDetail';
import type { Config as ConfigMetaTrader } from '@fishbot/metatrader/types/Config.model';
import { ProviderType } from '@fishbot/utils/constants/account';
import delay from '@fishbot/utils/helpers/delay';
import { getVolumeFromLot } from '@fishbot/utils/helpers/price';
import type { Config } from '@fishbot/utils/types/Account.model';
import type { Price } from '@fishbot/utils/types/Price.model';
import _ from 'lodash';

import type { SymbolMetaTrader } from '~types/Symbol.model';
import { saveSymbols } from '~utils/price';

import connectAndRun from './connectAndRun';

// https://get.exness.help/hc/en-us/articles/360010646760-Trading-on-cryptocurrencies#h_f0a4c27f-b15c-40fc-8838-a454fa06f644
// **It is not possible to close orders for less than 0.1 lot (10 lots for XRPUSD)
// by hedge/partial closing for BCHUSD, ETHUSD, XRPUSD, and LTCUSD.
const fixExness = (res: any) => {
  switch (res.symbol) {
    case 'BCHUSD':
    case 'ETHUSD':
    case 'LTCUSD':
      return { ...res, minVolume: 0.1 };
    case 'XRPUSD':
      return { ...res, minVolume: 10 };
    default:
      return res;
  }
};

const updateSymbols = async (params: {
  providerId: string,
  providerType: ProviderType,
  config: Config,
  allSymbols: SymbolMetaTrader[],
}) => {
  const {
    providerId, providerType, config, allSymbols,
  } = params;

  await connectAndRun({
    providerId,
    handler: async (connection) => {
      Logger.info(`Updating ${allSymbols.length} symbols`);
      const symbols: Omit<Price, 'last'>[] = [];

      for (const symbol of allSymbols) {
        let detail = await getSymbolDetail(connection, symbol);

        if (providerType === ProviderType.exness) {
          detail = fixExness(detail);
        }

        const doc: Omit<Price, 'last'> & {
          minLot: number;
          maxLot: number;
        } = {
          _id: `${providerType}-${symbol}`,
          providerType,
          symbol,
          symbolId: symbol,
          baseAsset: detail.baseCurrency || '',
          quoteAsset: detail.symbol.substring(detail.baseCurrency.length) || '',
          lotSize: detail.contractSize || 0,
          pipSize: detail.pipSize || 0,
          digits: detail.digits || 0,
          minLot: detail.minVolume || 0,
          maxLot: detail.maxVolume || 0,
          minVolume: 0,
          maxVolume: 0,
          providerData: detail,
        };

        doc.minVolume = getVolumeFromLot({
          providerType,
          symbol,
          lot: doc.minLot,
          prices: { [doc._id]: doc },
        }).volume || 0;

        doc.maxVolume = getVolumeFromLot({
          providerType,
          symbol,
          lot: doc.maxLot,
          prices: { [doc._id]: doc },
        }).volume || 0;

        symbols.push(doc);

        await delay(500);
      }
      Logger.debug(`Saving ${symbols.length} symbols`, symbols);
      await saveSymbols(providerType, symbols);
      Logger.info(`Updated ${symbols.length} symbols`);
    },
    config: config as ConfigMetaTrader,
  });
};

export default updateSymbols;
