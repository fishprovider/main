import type { ProviderType } from '@fishprovider/utils/constants/account';
import { redisKeys } from '@fishprovider/utils/constants/redis';
import { isLastRunExpired } from '@fishprovider/utils/helpers/lastRunChecks/lastRunChecks';
import type { Asset, Price } from '@fishprovider/utils/types/Price.model';
import type {
  RedisAsset,
  RedisPrice,
  RedisSymbol,
} from '@fishprovider/utils/types/Redis.model';
import _ from 'lodash';

const savePriceRuns = {};

const caches: Record<ProviderType, {
  assetIds: Record<string, string>;
  assetNames: Record<string, string>;
  symbolIds: Record<string, RedisSymbol>;
  symbolNames: Record<string, RedisSymbol>;
}> = {} as any;

//
// assets
//

const getAssetsFromMongo = async (providerType: ProviderType) => {
  const assets = await Mongo.collection<RedisAsset>('assets').find(
    { providerType },
    {
      projection: {
        asset: 1,
        assetId: 1,
      },
    },
  ).toArray();
  return assets;
};

const setAssetsToRedis = async (providerType: ProviderType, assets: RedisAsset[]) => {
  await Redis.set(redisKeys.assets(providerType), JSON.stringify(assets), {
    EX: 60 * 60 * 24 * 30,
  });
};

const getAssetsFromRedis = async (providerType: ProviderType) => {
  const redisCache = await Redis.get(redisKeys.assets(providerType));
  if (!redisCache) {
    const assets = await getAssetsFromMongo(providerType);
    await setAssetsToRedis(providerType, assets);
    return assets;
  }
  const assets = JSON.parse(redisCache) as RedisAsset[];
  return assets;
};

const parseAssets = (assets: RedisAsset[]) => {
  const assetIds: Record<string, string> = {};
  const assetNames: Record<string, string> = {};
  assets.forEach((item) => {
    assetIds[item.assetId] = item.asset;
    assetNames[item.asset] = item.assetId;
  });
  return { assetIds, assetNames };
};

const setAssets = (providerType: ProviderType, assets: RedisAsset[]) => {
  const { assetIds, assetNames } = parseAssets(assets);
  _.set(caches[providerType], 'assetIds', assetIds);
  _.set(caches[providerType], 'assetNames', assetNames);
  return { assetIds, assetNames };
};

const getAssets = async (providerType: ProviderType) => {
  if (!caches[providerType]?.assetIds) {
    const assets = await getAssetsFromRedis(providerType);
    const { assetIds, assetNames } = setAssets(providerType, assets);
    return { assetIds, assetNames };
  }
  const { assetIds, assetNames } = caches[providerType];
  return { assetIds, assetNames };
};

const saveAssets = async (providerType: ProviderType, assets: Asset[]) => {
  setAssets(providerType, assets);
  await setAssetsToRedis(providerType, assets.map((item) => ({
    asset: item.asset,
    assetId: item.assetId,
  })));
  for (const item of assets) {
    const docId = `${providerType}-${item.asset}`;
    await Mongo.collection<Asset>('assets').updateOne(
      { _id: docId },
      {
        $set: {
          ...item,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    );
  }
};

const reloadAssets = async (providerType: ProviderType) => {
  const assets = await getAssetsFromMongo(providerType);
  await setAssetsToRedis(providerType, assets);
  setAssets(providerType, assets);
};

//
// symbols
//

const getSymbolsFromMongo = async (providerType: ProviderType) => {
  const symbols = await Mongo.collection<Price>('price').find(
    { providerType },
    {
      projection: {
        symbol: 1,
        symbolId: 1,
        baseAsset: 1,
        quoteAsset: 1,
        lotSize: 1,
        pipSize: 1,
        digits: 1,
        minVolume: 1,
        maxVolume: 1,
      },
    },
  ).toArray();
  return symbols;
};

const setSymbolsToRedis = async (providerType: ProviderType, symbols: RedisSymbol[]) => {
  await Redis.set(redisKeys.symbols(providerType), JSON.stringify(symbols), {
    EX: 60 * 60 * 24 * 30,
  });
};

const getSymbolsFromRedis = async (providerType: ProviderType) => {
  const redisCache = await Redis.get(redisKeys.symbols(providerType));
  if (!redisCache) {
    const symbols = await getSymbolsFromMongo(providerType);
    await setSymbolsToRedis(providerType, symbols);
    return symbols;
  }
  const symbols = JSON.parse(redisCache) as RedisSymbol[];
  return symbols;
};

const parseSymbols = (symbols: RedisSymbol[]) => {
  const symbolIds: Record<string, RedisSymbol> = {};
  const symbolNames: Record<string, RedisSymbol> = {};
  symbols.forEach((item) => {
    symbolIds[item.symbolId] = {
      symbol: item.symbol,
      symbolId: item.symbolId,
      baseAsset: item.baseAsset,
      quoteAsset: item.quoteAsset,
      lotSize: item.lotSize,
      pipSize: item.pipSize,
      digits: item.digits,
      minVolume: item.minVolume,
      maxVolume: item.maxVolume,
    };
    symbolNames[item.symbol] = {
      symbol: item.symbol,
      symbolId: item.symbolId,
      baseAsset: item.baseAsset,
      quoteAsset: item.quoteAsset,
      lotSize: item.lotSize,
      pipSize: item.pipSize,
      digits: item.digits,
      minVolume: item.minVolume,
      maxVolume: item.maxVolume,
    };
  });
  return { symbolIds, symbolNames };
};

const setSymbols = (providerType: ProviderType, symbols: RedisSymbol[]) => {
  const { symbolIds, symbolNames } = parseSymbols(symbols);
  _.set(caches[providerType], 'symbolIds', symbolIds);
  _.set(caches[providerType], 'symbolNames', symbolNames);
  return { symbolIds, symbolNames };
};

const getSymbols = async (providerType: ProviderType) => {
  if (!caches[providerType]?.symbolIds) {
    const symbols = await getSymbolsFromRedis(providerType);
    const { symbolIds, symbolNames } = setSymbols(providerType, symbols);
    return { symbolIds, symbolNames };
  }
  const { symbolIds, symbolNames } = caches[providerType];
  return { symbolIds, symbolNames };
};

const saveSymbols = async (providerType: ProviderType, symbols: Omit<Price, 'last'>[]) => {
  setSymbols(providerType, symbols);
  await setSymbolsToRedis(providerType, symbols.map((item) => ({
    symbol: item.symbol,
    symbolId: item.symbolId,
    baseAsset: item.baseAsset,
    quoteAsset: item.quoteAsset,
    lotSize: item.lotSize,
    pipSize: item.pipSize,
    digits: item.digits,
    minVolume: item.minVolume,
    maxVolume: item.maxVolume,
  })));
  for (const item of symbols) {
    const docId = `${providerType}-${item.symbol}`;
    await Mongo.collection<Price>('price').updateOne(
      { _id: docId },
      {
        $set: {
          ...item,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    );
  }
};

const reloadSymbols = async (providerType: ProviderType) => {
  const symbols = await getSymbolsFromMongo(providerType);
  await setSymbolsToRedis(providerType, symbols);
  setSymbols(providerType, symbols);
};

//
// prices
//

const getPrices = async (providerType: ProviderType, symbols: string[]) => {
  const { symbolNames } = await getSymbols(providerType);

  const prices: Record<string, Price> = {};
  const cacheMissedSymbols: string[] = [];

  for (const symbol of symbols) {
    const cache = await Redis.get(redisKeys.price(providerType, symbol));
    const cacheSymbol = symbolNames[symbol];
    if (cache && cacheSymbol) {
      const price = JSON.parse(cache) as RedisPrice;
      prices[`${providerType}-${symbol}`] = {
        ...cacheSymbol,
        ...price,
        _id: `${providerType}-${symbol}`,
        providerType,
      };
    } else {
      cacheMissedSymbols.push(symbol);
    }
  }

  if (cacheMissedSymbols.length) {
    const priceDocs = await Mongo.collection<Price>('price').find(
      {
        providerType,
        symbol: { $in: cacheMissedSymbols },
      },
    ).toArray();
    priceDocs.forEach((price) => {
      prices[price._id] = price;
    });
  }

  return prices;
};

const savePrice = async (providerType: ProviderType, symbol: string, price: RedisPrice) => {
  Redis.publish(redisKeys.price(providerType, symbol), JSON.stringify(price));
  await Redis.set(redisKeys.price(providerType, symbol), JSON.stringify(price), {
    EX: 60 * 60 * 24 * 7,
  });

  const docId = `${providerType}-${symbol}`;
  if (
    !isLastRunExpired({
      runs: savePriceRuns,
      runId: docId,
      timeUnit: 'seconds',
      timeAmt: Math.random() * 30 + 30, // random from 30s to 60s
      checkIds: [],
    })
  ) return;
  await Mongo.collection<Price>('price').updateOne(
    { _id: docId },
    {
      $set: {
        ...price,
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );
};

export {
  getAssets,
  getPrices,
  getSymbols,
  parseSymbols,
  reloadAssets,
  reloadSymbols,
  saveAssets,
  savePrice,
  saveSymbols,
};
