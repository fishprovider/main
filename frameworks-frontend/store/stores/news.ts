import type { News } from '@fishprovider/enterprise';

import { buildStoreSet } from '../store.framework';

export const storeNews = buildStoreSet<News>({}, 'news');
