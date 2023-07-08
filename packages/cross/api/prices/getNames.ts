import type { ProviderType } from '@fishprovider/utils/constants/account';
import type { Price } from '@fishprovider/utils/types/Price.model';

import { ApiConfig, apiGet } from '~libs/api';
import storePrices from '~stores/prices';

const priceGetNames = async (
  payload: {
    providerType: ProviderType,
  },
  options?: ApiConfig,
) => {
  const docs = await apiGet<Price[]>('/prices/getNames', payload, options);
  storePrices.mergeDocs(docs);
  return docs;
};

export default priceGetNames;
