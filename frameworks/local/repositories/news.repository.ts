import {
  DefaultNewsRepository,
  type NewsRepository,
  type SetNewsRepositoryParams,
} from '@fishprovider/application-rules';
import type { News } from '@fishprovider/enterprise-rules';

import { local } from '../local.framework';

async function setNews(params: SetNewsRepositoryParams) {
  const { localSet } = await local.get();
  await localSet('news', params.news);
  return true;
}

async function getNews() {
  const { localGet } = await local.get();
  const news = await localGet<News[]>('news');
  return news;
}

export const LocalNewsRepository: NewsRepository = {
  ...DefaultNewsRepository,
  setNews,
  getNews,
};
