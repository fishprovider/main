import type { ProviderType } from '@fishbot/utils/constants/account';
import type { Price } from '@fishbot/utils/types/Price.model';

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
