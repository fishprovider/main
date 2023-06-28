import _ from 'lodash';

import type { ProviderType } from '~constants/account';
import { Direction } from '~constants/order';
import { forexMajorPairs } from '~constants/price';
import type { Price } from '~types/Price.model';
import type { RedisPrice, RedisSymbol } from '~types/Redis.model';

const getMajorPairs = (providerType: ProviderType) => {
  switch (providerType) {
    default:
      return forexMajorPairs;
  }
};

const getConversionPairs = (
  baseAsset: string,
  quoteAsset: string,
  asset: string,
) => ({
  quoteFirst: `${quoteAsset}${asset}`,
  quoteLast: `${asset}${quoteAsset}`,
  baseFirst: `${baseAsset}${asset}`,
  baseLast: `${asset}${baseAsset}`,
});

const getConversionRate = (
  providerType: ProviderType,
  symbol: string,
  asset: string,
  prices: Record<string, Price>,
) => {
  const { baseAsset, quoteAsset, last } = prices[`${providerType}-${symbol}`] || {};
  if (!baseAsset) return { error: `Unknown baseAsset of ${symbol}` };
  if (!quoteAsset) return { error: `Unknown quoteAsset of ${symbol}` };
  if (!last) return { error: `Unknown last price of ${symbol}` };

  // e.g. for GBPUSD=1.5, 10 USD MinTP is 10 USD * 1 = 10 USD
  if (quoteAsset === asset) return { conversionRate: 1 };

  // e.g. for USDJPY=120, 10 USD MinTP is 10 USD * 120 = 1200 JPY
  if (baseAsset === asset) return { conversionRate: last };

  const conversionPairs = getConversionPairs(baseAsset, quoteAsset, asset);

  // e.g. for RUBEUR=0.02, 10 USD MinTP is 10 USD / 1.2 = 8.33 EUR (if quoteFirst EURUSD=1.2)
  const priceDocQuoteFirst = prices[`${providerType}-${conversionPairs.quoteFirst}`];
  if (priceDocQuoteFirst) return { conversionRate: 1 / priceDocQuoteFirst.last };

  // e.g. for RUBJPY=2.5, 10 USD MinTP is 10 USD * 120 = 1200 JPY  (if quoteLast USDJPY=120)
  const priceDocQuoteLast = prices[`${providerType}-${conversionPairs.quoteLast}`];
  if (priceDocQuoteLast) return { conversionRate: priceDocQuoteLast.last };

  // e.g. for EURRUB=70, 10 USD MinTP is 10 USD / 1.2 * 70 = 583.33 RUB (if baseFirst EURUSD=1.2)
  const priceDocBaseFirst = prices[`${providerType}-${conversionPairs.baseFirst}`];
  if (priceDocBaseFirst) return { conversionRate: last / priceDocBaseFirst.last };

  // e.g. for JPYRUB=0.4, 10 USD MinTP is 10 USD * 120 * 0.4 = 480 RUB (if baseLast USDJPY=120)
  const priceDocBaseLast = prices[`${providerType}-${conversionPairs.baseLast}`];
  if (priceDocBaseLast) return { conversionRate: priceDocBaseLast.last * last };

  return { error: `Unknown conversionRate for ${symbol} and ${asset}` };
};

const getPriceFromAmount = ({
  direction, volume, entry, assetAmt, rate,
}: {
  direction: Direction,
  volume: number,
  entry: number,
  assetAmt: number,
  rate: number,
}) => (direction === Direction.buy
  ? entry + ((assetAmt * rate) / volume)
  : entry - ((assetAmt * rate) / volume)
);

const getGrossProfit = ({
  direction, volume, entry, price, rate = 1,
}: {
  direction: Direction,
  volume: number,
  entry: number,
  price: RedisPrice,
  rate?: number,
}) => {
  const { last, bid, ask } = price;
  const priceDiff = (direction === Direction.buy
    ? (bid || last || entry) - entry
    : entry - (ask || last || entry)
  );
  return (priceDiff * volume) / rate;
};

const getLotFromVolume = ({
  providerType, symbol, volume, prices,
}: {
  providerType: ProviderType;
  symbol: string;
  volume: number;
  prices: Record<string, Price> | Record<string, RedisSymbol>;
}) => {
  const lotSize = (prices[`${providerType}-${symbol}`] || prices[symbol])?.lotSize;
  if (!lotSize) {
    return { error: `LotSize is not found for ${providerType} ${symbol}` };
  }
  return { lot: _.round(volume / lotSize, 2) };
};

const getVolumeFromLot = ({
  providerType, symbol, lot, prices,
}: {
  providerType: ProviderType;
  symbol: string;
  lot: number;
  prices: Record<string, Price> | Record<string, RedisSymbol>;
}) => {
  const lotSize = (prices[`${providerType}-${symbol}`] || prices[symbol])?.lotSize;
  if (!lotSize) {
    return { error: `LotSize is not found for ${providerType} ${symbol}` };
  }
  return { volume: lot * lotSize };
};

const getDiffPips = ({
  providerType, symbol, prices, entry, price,
}: {
  providerType: ProviderType;
  symbol: string;
  prices: Record<string, Price> | Record<string, RedisSymbol>;
  entry: number;
  price: number;
}) => {
  const pipSize = (prices[`${providerType}-${symbol}`] || prices[symbol])?.pipSize;
  if (!pipSize) {
    return { error: `PipSize is not found for ${providerType} ${symbol}` };
  }
  return { pips: (price - entry) / pipSize };
};

const getVolumeRound = ({
  providerType, symbol, prices, volume,
  roundToMinIfTooSmall = true,
  roundToMaxIfTooLarge = true,
}: {
  providerType: ProviderType;
  symbol: string;
  prices: Record<string, Price> | Record<string, RedisSymbol>;
  volume: number;
  roundToMinIfTooSmall?: boolean;
  roundToMaxIfTooLarge?: boolean;
}) => {
  const minVolume = (prices[`${providerType}-${symbol}`] || prices[symbol])?.minVolume;
  if (!minVolume) {
    return { error: `MinVolume is not found for ${providerType} ${symbol}` };
  }
  const maxVolume = (prices[`${providerType}-${symbol}`] || prices[symbol])?.maxVolume;
  if (!maxVolume) {
    return { error: `MaxVolume is not found for ${providerType} ${symbol}` };
  }

  let volumeRound = volume;
  volumeRound = roundToMinIfTooSmall ? Math.max(volumeRound, minVolume) : volumeRound;
  volumeRound = roundToMaxIfTooLarge ? Math.min(volumeRound, maxVolume) : volumeRound;
  volumeRound = Math.round(volumeRound / minVolume) * minVolume;
  return { volume: volumeRound };
};

export {
  getConversionRate,
  getDiffPips,
  getGrossProfit,
  getLotFromVolume,
  getMajorPairs,
  getPriceFromAmount,
  getVolumeFromLot,
  getVolumeRound,
};
