import statsGetManyKeyLevels from '@fishprovider/cross/dist/api/stats/getManyKeyLevels';
import storePrices from '@fishprovider/cross/dist/stores/prices';
import storeStats from '@fishprovider/cross/dist/stores/stats';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { ProviderType } from '@fishprovider/utils/dist/constants/account';
import { getDiffPips } from '@fishprovider/utils/dist/helpers/price';
import _ from 'lodash';
import moment from 'moment';
import { useEffect } from 'react';

import Box from '~ui/core/Box';
import Text from '~ui/core/Text';

interface Props {
  symbol: string;
  timeFr: string;
}

function KeyLevelTimeFr({ symbol, timeFr }: Props) {
  const {
    providerType = ProviderType.icmarkets,
  } = storeUser.useStore((state) => ({
    providerType: state.activeProvider?.providerType,
  }));
  const priceDoc = storePrices.useStore((prices) => prices[`${providerType}-${symbol}`]);
  const srTimeFr = storeStats.useStore((state) => _.find(
    state,
    (item) => item.type === 'keyLevels' && item.symbol === symbol && item.timeFr === timeFr,
  ));

  useEffect(() => {
    if (symbol) {
      statsGetManyKeyLevels({ symbol });
    }
  }, [symbol]);

  if (!srTimeFr) return null;

  const color = timeFr === 'Daily' ? 'red' : 'orange';
  const keyLevels = _.orderBy(
    _.concat<number>(
      srTimeFr.keyLevels || [],
      _.fill(Array(10 - (srTimeFr.keyLevels?.length || 0)), 0),
    ),
    (item) => item,
    'desc',
  );
  const topIndex = _.findLastIndex(keyLevels, (item) => !!priceDoc?.last && item > priceDoc.last);
  const bottomIndex = _.findIndex(keyLevels, (item) => !!priceDoc?.last && item < priceDoc.last);

  return (
    <Box key={srTimeFr._id}>
      <Text color={color}>{timeFr}</Text>
      <Text fz="xs" fs="italic">
        {`Updated ${moment(srTimeFr.updatedAt).fromNow()}`}
      </Text>
      {_.map(keyLevels, (keyLevel, index) => {
        const currentSR = {} as {
          color: string;
          pips: number;
          fontWeight: string;
        };
        if (index === topIndex) {
          currentSR.color = color;
          if (priceDoc && keyLevels[topIndex]) {
            currentSR.pips = _.round(
              getDiffPips({
                providerType,
                symbol,
                prices: { [priceDoc._id]: priceDoc },
                entry: keyLevels[topIndex] as number,
                price: priceDoc?.last,
              }).pips || 0,
            );
          }
          if (currentSR.pips < 15) {
            currentSR.fontWeight = 'bold';
          }
        } else if (index === bottomIndex) {
          currentSR.color = color;
          if (priceDoc && keyLevels[topIndex]) {
            currentSR.pips = _.round(
              getDiffPips({
                providerType,
                symbol,
                prices: { [priceDoc._id]: priceDoc },
                entry: priceDoc?.last,
                price: keyLevels[topIndex] as number,
              }).pips || 0,
            );
          }
          if (currentSR.pips < 15) {
            currentSR.fontWeight = 'bold';
          }
        }
        return (
          <Text key={index} color={currentSR.color} fw={currentSR.fontWeight}>
            {`${keyLevel || ''} ${currentSR.pips ? `(${currentSR.pips} pips)` : ''}`}
          </Text>
        );
      })}
    </Box>
  );
}

export default KeyLevelTimeFr;
