import type { News } from '@fishprovider/utils/dist/types/News.model';

import { buildStoreSet } from '~libs/store';

const storeNews = buildStoreSet<News>({}, 'news');

export default storeNews;
