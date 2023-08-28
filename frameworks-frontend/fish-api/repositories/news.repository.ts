import { DefaultNewsRepository, type GetNewsRepositoryParams, type NewsRepository } from '@fishprovider/application';
import type { News } from '@fishprovider/core-new';
import { StoreNewsRepository } from '@fishprovider/framework-store';

import { fishApi } from '../fishApi.framework';

const getNews = async (params: GetNewsRepositoryParams) => {
  const { apiGet } = await fishApi.get();
  const news = await apiGet<News[]>('/news/getNews', params);
  StoreNewsRepository.setNews({ news });
  return news;
};

export const FishApiNewsRepository: NewsRepository = {
  ...DefaultNewsRepository,
  getNews,
};
