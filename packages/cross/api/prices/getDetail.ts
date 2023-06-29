import type { ProviderType } from '@fishbot/utils/constants/account';
import type { Price } from '@fishbot/utils/types/Price.model';

import { ApiConfig, apiGet } from '~libs/api';
import storePrices from '~stores/prices';

const priceGetDetail = async (
  payload: {
    providerType: ProviderType,
    symbol: string,
  },
  options?: ApiConfig,
) => {
  const doc = await apiGet<Price | undefined>('/prices/getDetail', payload, options);
  if (doc) {
    storePrices.mergeDoc(doc);
  }
  return doc;
};

export default priceGetDetail;
