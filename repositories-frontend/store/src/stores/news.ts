import type { News } from '@fishprovider/core-new';

import { buildStoreSet } from '../main';

export const storeNews = buildStoreSet<News>({}, 'news');
