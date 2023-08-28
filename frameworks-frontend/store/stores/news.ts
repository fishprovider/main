import type { News } from '@fishprovider/core-new';

import { buildStoreSet } from '../store.framework';

export const storeNews = buildStoreSet<News>({}, 'news');
