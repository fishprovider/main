import type { Stat } from '@fishprovider/utils/dist/types/Stat.model';

import { buildStoreSet } from '~libs/store';

const storeStats = buildStoreSet<Stat>({}, 'stats');

export default storeStats;
