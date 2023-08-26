import type { News } from '@fishprovider/models';

import { buildStoreSet } from '../store.framework';

export const storeNews = buildStoreSet<News>({}, 'news');
