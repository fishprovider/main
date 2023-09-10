import { News } from '@fishprovider/core';

import { buildStoreSet } from '..';

export const storeNews = buildStoreSet<News>({}, 'news');
