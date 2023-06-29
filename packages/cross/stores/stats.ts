import type { Stat } from '@fishbot/utils/types/Stat.model';

import { buildStoreSet } from '~libs/store';

const storeStats = buildStoreSet<Stat>({}, 'stats');

export default storeStats;
