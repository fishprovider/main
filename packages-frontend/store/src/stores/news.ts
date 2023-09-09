import { News } from '@fishprovider-new/core';

import { buildStoreSet } from '../main';

export const storeNews = buildStoreSet<News>({}, 'news');
