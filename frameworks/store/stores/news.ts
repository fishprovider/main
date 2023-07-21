import type { News } from '@fishprovider/enterprise-rules';

import { buildStoreSet } from '../store.framework';

export const storeNews = buildStoreSet<News>({}, 'news');
