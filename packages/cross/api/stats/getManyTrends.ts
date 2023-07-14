import type { Stat } from '@fishprovider/utils/dist/types/Stat.model';

import { ApiConfig, apiGet } from '~libs/api';
import storeStats from '~stores/stats';

const statsGetManyTrends = async (
  payload: {
    symbol: string;
  },
  options?: ApiConfig,
) => {
  const { symbol } = payload;
  const docs = await apiGet<Stat[]>('/stats/getMany', {
    type: 'trends',
    typeData: {
      symbol,
    },
  }, options);
  storeStats.mergeDocs(docs);
  return docs;
};

export default statsGetManyTrends;
