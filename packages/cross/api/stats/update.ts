import type { Stat } from '@fishbot/utils/types/Stat.model';

import { ApiConfig, apiPost } from '~libs/api';
import storeStats from '~stores/stats';

const statsUpdate = async (
  payload: {
    docId: string;
    doc: Partial<Stat>;
  },
  options?: ApiConfig,
) => {
  const doc = await apiPost<Stat>('/stats/update', payload, options);
  storeStats.mergeDoc(doc);
  return doc;
};

export default statsUpdate;
