import type { News } from '@fishprovider/utils/dist/types/News.model';

import { buildStoreSet } from '../store.framework';

export const storeNews = buildStoreSet<News>({}, 'news');
