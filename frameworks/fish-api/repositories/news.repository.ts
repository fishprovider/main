import type { GetNewsRepositoryParams, NewsRepository } from '@fishprovider/application-rules';
import type { News } from '@fishprovider/enterprise-rules';

import { fishApi } from '../fishApi.framework';

async function getNews(params: GetNewsRepositoryParams) {
  const { apiGet } = await fishApi.get();
  const docs = await apiGet<News[]>('/news/getNews', params);
  return docs;
}

export const FishApiNewsRepository: NewsRepository = {
  getNews,
};
