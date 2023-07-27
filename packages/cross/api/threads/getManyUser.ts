import type { Thread } from '@fishprovider/utils/dist/types/Thread.model';

import { ApiConfig, apiPost } from '~libs/api';
import storeThreads from '~stores/threads';

const threadGetManyUser = async (
  options?: ApiConfig,
) => {
  const docs = await apiPost<Thread[]>('/threads/getManyUser', {}, options);
  storeThreads.mergeDocs(docs);
  return docs;
};

export default threadGetManyUser;
