import storePrices from '@fishbot/cross/stores/prices';
import storeUser from '@fishbot/cross/stores/user';
import { ProviderType } from '@fishbot/utils/constants/account';
import { getDiffPips } from '@fishbot/utils/helpers/price';
import _ from 'lodash';
import moment from 'moment';

import Tooltip from '~ui/core/Tooltip';
import { getMarketState } from '~utils/price';

function PriceView() {
  const {
    providerType = ProviderType.icmarkets,
    providerPlatform,
    symbol,
  } = storeUser.useStore((state) => ({
    providerType: state.activeProvider?.providerType,
    providerPlatform: state.activeProvider?.providerPlatform,
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

  const marketState = getMarketState(providerPlatform, providerData);

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
