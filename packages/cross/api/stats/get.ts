import type { Stat } from '@fishprovider/utils/dist/types/Stat.model';

import { ApiConfig, apiGet } from '~libs/api';
import storeStats from '~stores/stats';

const statsGet = async (
  payload: {
    statId: string;
  },
  options?: ApiConfig,
) => {
  const doc = await apiGet<Stat>('/stats/get', payload, options);
  storeStats.mergeDoc(doc);
  return doc;
};

export default statsGet;
