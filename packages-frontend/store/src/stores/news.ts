import { News } from '@fishprovider/core';

import { buildStoreSet } from '../main';

export const storeNews = buildStoreSet<News>({}, 'news');
