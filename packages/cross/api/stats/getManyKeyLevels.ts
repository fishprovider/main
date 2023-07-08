import type { Stat } from '@fishprovider/utils/types/Stat.model';

import { ApiConfig, apiGet } from '~libs/api';
import storeStats from '~stores/stats';

const statsGetManyKeyLevels = async (
  payload: {
    symbol: string;
  },
  options?: ApiConfig,
) => {
  const { symbol } = payload;
  const docs = await apiGet<Stat[]>('/stats/getMany', {
    type: 'keyLevels',
    typeData: {
      symbol,
    },
  }, options);
  storeStats.mergeDocs(docs);
  return docs;
};

export default statsGetManyKeyLevels;
