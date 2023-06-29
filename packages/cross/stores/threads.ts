import type { Thread } from '@fishbot/utils/types/Thread.model';

import { buildStoreSet } from '~libs/store';

const storeThreads = buildStoreSet<Thread>({}, 'threads');

export default storeThreads;
