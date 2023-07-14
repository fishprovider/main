import getSymbolDetail from '@fishprovider/ctrader/dist/commands/getSymbolDetail';
import type { ConnectionType } from '@fishprovider/ctrader/dist/types/Connection.model';
import type { CallbackPayload } from '@fishprovider/ctrader/dist/types/Event.model';
import { getSymbols, reloadSymbols } from '@fishprovider/swap/dist/utils/price';
import type { ProviderType } from '@fishprovider/utils/dist/constants/account';
import delay from '@fishprovider/utils/dist/helpers/delay';
import type { Price } from '@fishprovider/utils/dist/types/Price.model';
import _ from 'lodash';

const handleEventSymbol = async (
  providerType: ProviderType,
  payload: CallbackPayload,
  getConnection: () => ConnectionType | undefined,
) => {
  const { symbolIds: symbolIdsNew } = payload;
  const connection = getConnection();
  try {
    const { symbolIds } = await getSymbols(providerType);

    for (const { symbolId } of symbolIdsNew) {
      if (!symbolId) return;

      const { symbol, baseAsset, quoteAsset } = symbolIds[symbolId] || {};
      if (!symbol) {
        Logger.warn(`Unknown symbol: ${symbolId}`);
        return;
      }
      if (!connection) {
        Logger.warn('Connection not found');
        return;
      }

      const { symbols: details } = await getSymbolDetail(connection, [+symbolId]);
      const detail = details[0];

      const doc = {
        _id: `${providerType}-${symbol}`,
        providerType,
        symbol,
        symbolId,
        baseAsset: baseAsset || '',
        quoteAsset: quoteAsset || '',
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

      await Mongo.collection<Price>('price').updateOne(
        { _id: doc._id },
        {
          $set: {
            ...doc,
            providerData: {
              ...detail,
              details: _.tail(details),
            },
            updatedAt: new Date(),
          },
        },
        { upsert: true },
      );

      await delay(500);
    }

    await reloadSymbols(providerType);
  } catch (err) {
    Logger.error('Failed to handleEventSymbol', err);
  }
};

export default handleEventSymbol;
