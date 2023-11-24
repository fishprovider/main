import { AccountType, getMajorPairs } from '@fishprovider/core';
import storePrices from '@fishprovider/cross/dist/stores/prices';
import { getConversionRate } from '@fishprovider/utils/dist/helpers/price';
import _ from 'lodash';

import { watchUserInfoController } from '~controllers/user.controller';

const useConversionRate = (symbol: string) => {
  const {
    accountType = AccountType.icmarkets,
    asset = 'USD',
  } = watchUserInfoController((state) => ({
    accountType: state.activeAccount?.accountType,
    asset: state.activeAccount?.asset,
  }));

  const symbols = _.uniq([...getMajorPairs(accountType), symbol]);

  const prices = storePrices.useStore((state) => _.pickBy(
    state,
    (item) => item.providerType === accountType as any && symbols.includes(item.symbol),
  ));

  let rate = 0;

  const { conversionRate, error } = getConversionRate(
    accountType as any,
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
