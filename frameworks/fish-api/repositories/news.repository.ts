import { DefaultNewsRepository, type GetNewsRepositoryParams, type NewsRepository } from '@fishprovider/application-rules';
import type { News } from '@fishprovider/enterprise-rules';
import { StoreNewsRepository } from '@fishprovider/framework-store';

import { fishApi } from '../fishApi.framework';

async function getNews(params: GetNewsRepositoryParams) {
  const { apiGet } = await fishApi.get();
  const docs = await apiGet<News[]>('/news/getNews', params);
  StoreNewsRepository.setNews({ news: docs });
  return docs;
}

export const FishApiNewsRepository: NewsRepository = {
  ...DefaultNewsRepository,
  getNews,
};
