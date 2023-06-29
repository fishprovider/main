import type { Price } from '@fishbot/utils/types/Price.model';

import Mark from '~ui/core/Mark';
import Text from '~ui/core/Text';

const groupByBaseAsset = (prices: Price[], pairs: string[]) => {
  const group = pairs.reduce((acc, cur) => {
    const baseAsset = prices.find((price) => price.symbol === cur)?.baseAsset
      || cur.substring(0, 3);
    if (!acc[baseAsset]) {
      acc[baseAsset] = [];
    }
    (acc[baseAsset] as string[]).push(cur);
    return acc;
  }, {} as Record<string, string[]>);
  return Object.entries(group).sort((a, b) => a[0].localeCompare(b[0]));
};

const renderPairs = (baseAsset: string, pairs: string[], lot = 0) => (
  <Text key={`${baseAsset}-${lot}`}>
    <Mark>{`${baseAsset}${lot ? `: ${lot}` : ''}`}</Mark>
    {`【${pairs.join(', ')}】`}
  </Text>
);

/**
 * @param prices: Price[]
 * @param pairs ['XAUUSD', 'USDJPY']:
 * @param lot: 0.1
 */
export const Pairs = (
  prices: Price[],
  pairs: string[],
) => groupByBaseAsset(prices, pairs)
  .map(([baseAsset, pairsItem]) => renderPairs(baseAsset, pairsItem));

/**
 * @param prices: Price
 * @param pairsLot { XAUUSD: 0.1, USDJPY: 0.2 }
 */
export const PairsWithLot = (prices: Price[], pairsLot: Record<string, number>) => {
  const groupByLot: Record<number, string[]> = {};
  Object.entries(pairsLot).forEach(([pair, lot]) => {
    if (!groupByLot[lot]) {
      groupByLot[lot] = [];
    }
    (groupByLot[lot] as string[]).push(pair);
  });
  const sortedArr = Object.entries(groupByLot)
    .flatMap(([lot, pairs]) => groupByBaseAsset(prices, pairs).map((group) => ({
      lot,
      baseAsset: group[0],
      pairs: group[1],
    })))
    .sort((a, b) => a.baseAsset.localeCompare(b.baseAsset));
  return sortedArr.map(({ lot, baseAsset, pairs }) => renderPairs(baseAsset, pairs, +lot));
};
