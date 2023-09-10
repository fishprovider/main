import { News } from '@fishprovider/core';

import { buildStoreSet } from '../store';

export const storeNews = buildStoreSet<News>({}, 'news');
