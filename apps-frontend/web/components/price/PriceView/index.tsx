import { ProviderType } from '@fishprovider/core';
import storePrices from '@fishprovider/cross/dist/stores/prices';
import { getDiffPips } from '@fishprovider/utils/dist/helpers/price';
import _ from 'lodash';
import moment from 'moment';

import { watchUserInfoController } from '~controllers/user.controller';
import Tooltip from '~ui/core/Tooltip';
import { getMarketState } from '~utils/price';

function PriceView() {
  const {
    providerType = ProviderType.icmarkets,
    platform,
    symbol = 'AUDUSD',
  } = watchUserInfoController((state) => ({
    providerType: state.activeAccount?.providerType,
    platform: state.activeAccount?.platform,
    symbol: state.activeSymbol,
  }));
  const priceDoc = storePrices.useStore((prices) => prices[`${providerType}-${symbol}`]);

  if (!priceDoc) return null;

  const {
    bid, ask, last, time,
    providerData,
    digits = 0,
  } = priceDoc;

  const spread = bid && ask && getDiffPips({
    providerType,
    symbol,
    prices: { [priceDoc._id]: priceDoc },
    entry: bid,
    price: ask,
  }).pips;

  const marketState = getMarketState(platform, providerData);

  const isOutOfDate = moment().diff(moment(time), 'minutes') > 5;

  const priceInfo = _.compact([
    isOutOfDate && '❌ Out of date ❌',
    bid && `Bid ${_.round(bid, digits)}`,
    ask && `Ask ${_.round(ask, digits)}`,
    (spread || spread === 0) && `Spread ${_.round(spread, digits)}`,
  ]);

  const tooltip = marketState ? [
    `Updated ${moment(time).fromNow()}`,
    `Market ${_.compact([marketState.status, marketState.text]).join(', ')}`,
  ] : [];

  return (
    <Tooltip label={tooltip.join(', ')}>
      {_.round(last, digits)}
      {priceInfo.length ? ` (${priceInfo.join(', ')})` : ''}
    </Tooltip>
  );
}

export default PriceView;
