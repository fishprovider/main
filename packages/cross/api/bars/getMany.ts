import type { ProviderType } from '@fishprovider/utils/constants/account';
import type { Bar } from '@fishprovider/utils/types/Bar.model';

import { ApiConfig, apiGet } from '~libs/api';
import storeBars from '~stores/bars';

const barGetMany = async (
  payload: {
    providerType: ProviderType,
    symbol: string;
    period: string;
    scale: number;
  },
  options?: ApiConfig,
) => {
  const docs = await apiGet<Bar[]>('/bars/getMany', payload, options);
  storeBars.mergeDocs(docs);
  return docs;
};

export default barGetMany;
