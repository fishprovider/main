import type { ProviderType } from '@fishprovider/utils/constants/account';
import type { Price } from '@fishprovider/utils/types/Price.model';

import { ApiConfig, apiGet } from '~libs/api';
import storePrices from '~stores/prices';

const priceGetMany = async (
  payload: {
    providerType: ProviderType,
    symbols: string[];
    reload?: boolean,
  },
  options?: ApiConfig,
) => {
  const docs = await apiGet<Price[]>('/prices/getMany', payload, options);
  storePrices.mergeDocs(docs);
  return docs;
};

export default priceGetMany;
