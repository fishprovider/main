import type { News } from '@fishprovider/utils/dist/types/News.model';

import { apiGet } from '~libs/api';
import storeNews from '~stores/news';

const getNews = async (payload: {
  today?: boolean,
  week?: string,
  upcoming?: boolean,
}) => {
  const docs = await apiGet<News[]>('/v2/news/getNews', payload);
  storeNews.mergeDocs(docs);
  return docs;
};

export default getNews;
