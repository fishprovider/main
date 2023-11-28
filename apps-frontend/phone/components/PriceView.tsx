import { ProviderType } from '@fishprovider/core';
import storePrices from '@fishprovider/cross/dist/stores/prices';
import { getDiffPips } from '@fishprovider/utils/dist/helpers/price';
import _ from 'lodash';
import moment from 'moment';

import { watchUserInfoController } from '~controllers/user.controller';
import Text from '~ui/Text';

function PriceView() {
  const {
    providerType = ProviderType.icmarkets,
    symbol = 'AUDUSD',
  } = watchUserInfoController((state) => ({
    providerType: state.activeAccount?.providerType,
    symbol: state.activeSymbol,
  }));
  const priceDoc = storePrices.useStore((prices) => prices[`${providerType}-${symbol}`]);

  if (!priceDoc) return null;

  const {
    bid, ask, last, time,
    digits = 0,
  } = priceDoc;

  const spread = bid && ask && getDiffPips({
    providerType,
    symbol,
    prices: { [priceDoc._id]: priceDoc },
    entry: bid,
    price: ask,
  }).pips;

  const isOutOfDate = moment().diff(moment(time), 'minutes') > 5;

  const priceInfo = _.compact([
    isOutOfDate && '❌ Out of date ❌',
    bid && `Bid ${_.round(bid, digits)}`,
    ask && `Ask ${_.round(ask, digits)}`,
    (spread || spread === 0) && `Spread ${_.round(spread, digits)}`,
  ]);

  return (
    <Text>
      {_.round(last, digits)}
      {priceInfo.length ? ` (${priceInfo.join(', ')})` : ''}
    </Text>
  );
}

export default PriceView;
