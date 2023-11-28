import { ProviderType } from '@fishprovider/core';
import storePrices from '@fishprovider/cross/dist/stores/prices';
import { getConversionRate, getMajorPairs } from '@fishprovider/utils/dist/helpers/price';
import _ from 'lodash';

import { watchUserInfoController } from '~controllers/user.controller';

const useConversionRate = (symbol: string) => {
  const {
    providerType = ProviderType.icmarkets,
    asset = 'USD',
  } = watchUserInfoController((state) => ({
    providerType: state.activeAccount?.providerType,
    asset: state.activeAccount?.asset,
  }));

  const symbols = _.uniq([...getMajorPairs(providerType), symbol]);

  const prices = storePrices.useStore((state) => _.pickBy(
    state,
    (item) => item.providerType === providerType && symbols.includes(item.symbol),
  ));

  let rate = 0;

  const { conversionRate, error } = getConversionRate(
    providerType,
    symbol,
    asset,
    prices,
  );
  if (conversionRate) {
    rate = conversionRate;
  } else {
    Logger.debug(error);
  }
  return rate;
};

export default useConversionRate;
