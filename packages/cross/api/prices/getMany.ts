import type { ProviderType } from '@fishbot/utils/constants/account';
import type { Price } from '@fishbot/utils/types/Price.model';

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
