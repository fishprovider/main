import type { Thread } from '@fishprovider/utils/types/Thread.model';
import _ from 'lodash';

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
