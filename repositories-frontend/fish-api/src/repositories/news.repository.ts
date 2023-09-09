import {
  GetNewsFilter, News, NewsRepository,
} from '@fishprovider/core-new';

import { fishApi } from '../main';

const getNews = async (
  filter: GetNewsFilter,
) => {
  const { apiGet } = await fishApi.get();
  const news = await apiGet<Partial<News>[] | undefined>('/news/getNews', filter);
  return { docs: news };
};

export const FishApiNewsRepository: NewsRepository = {
  getNews,
};
