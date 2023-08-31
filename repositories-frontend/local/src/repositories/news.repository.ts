import {
  GetNewsFilter, type News, NewsRepository, RepositoryError,
} from '@fishprovider/core-new';

import { buildNewsKeys, local } from '..';

const getNews = async (filter: GetNewsFilter) => {
  const key = buildNewsKeys(filter);
  const { localGet } = await local.get();
  const news = await localGet<News[]>(key);
  return { docs: news ?? null };
};

const watchNews = () => {
  throw new Error(RepositoryError.REPOSITORY_BAD_RESULT);
};

export const LocalNewsRepository: NewsRepository = {
  getNews,
  watchNews,
};
