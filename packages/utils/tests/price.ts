import _ from 'lodash';

import { ProviderType } from '~constants/account';
import { getMajorPairs } from '~helpers/price';
import type { Price } from '~types/Price.model';

const getPriceDefault = (symbol = 'EURUSD'): Price => ({
  _id: `${ProviderType.icmarkets}-${symbol}`,
  providerType: ProviderType.icmarkets,
  symbol,
  symbolId: symbol,
  baseAsset: symbol.substring(0, 3),
  quoteAsset: symbol.substring(3),
  lotSize: 1000,
  pipSize: 0.0001,
  digits: 5,
  minVolume: 1000,
  maxVolume: 1000000,
  last: 1.23456,
});

const getPrice = ({
  symbol = 'EURUSD',
  last,
}: {
  symbol?: string;
  last?: number;
} = {}) => {
  const price = getPriceDefault(symbol);

  if (last) {
    price.last = last;
  }

  return price;
};

const getPrices = () => {
  const pricesArr = getMajorPairs(ProviderType.icmarkets).map((symbol) => getPrice({ symbol }));
  return _.keyBy(pricesArr, '_id');
};

export {
  getPrice,
  getPriceDefault,
  getPrices,
};
