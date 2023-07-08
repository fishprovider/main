import type { News } from '@fishprovider/utils/types/News.model';

import { ApiConfig, apiGet } from '~libs/api';
import storeNews from '~stores/news';

const newsGetMany = async (
  payload: {
    today?: boolean,
    week?: string,
    upcoming?: boolean,
  },
  options?: ApiConfig,
) => {
  const docs = await apiGet<News[]>('/news/getMany', payload, options);
  storeNews.mergeDocs(docs);
  return docs;
};

export default newsGetMany;
