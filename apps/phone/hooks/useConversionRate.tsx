import storePrices from '@fishprovider/cross/dist/stores/prices';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { ProviderType } from '@fishprovider/utils/dist/constants/account';
import { getConversionRate, getMajorPairs } from '@fishprovider/utils/dist/helpers/price';
import _ from 'lodash';

const useConversionRate = (symbol: string) => {
  const {
    providerType = ProviderType.icmarkets,
    asset = 'USD',
  } = storeUser.useStore((state) => ({
    providerType: state.activeProvider?.providerType,
    asset: state.activeProvider?.asset,
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
