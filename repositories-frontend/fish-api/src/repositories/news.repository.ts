import {
  type GetNewsFilter, type News, type NewsRepository,
  RepositoryError,
} from '@fishprovider/core-new';

import { fishApi } from '../main';

const getNews = async (
  filter: GetNewsFilter,
) => {
  const { apiGet } = await fishApi.get();
  const news = await apiGet<Partial<News>[] | null>('/news/getNews', filter);
  return { docs: news };
};

const watchNews = () => {
  throw new Error(RepositoryError.REPOSITORY_BAD_RESULT);
};

export const FishApiNewsRepository: NewsRepository = {
  getNews,
  watchNews,
};
