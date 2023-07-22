import {
  buildSetNewsKeys,
  DefaultNewsRepository,
  type GetNewsRepositoryParams,
  type NewsRepository,
  type SetNewsRepositoryParams,
} from '@fishprovider/application-rules';
import type { News } from '@fishprovider/enterprise-rules';

import { local } from '../local.framework';

async function setNews(params: SetNewsRepositoryParams) {
  const { news, key = 'news' } = params;
  const { localSet } = await local.get();
  await localSet(key, news);
  return true;
}

async function getNews(params: GetNewsRepositoryParams) {
  const key = buildSetNewsKeys(params);
  const { localGet } = await local.get();
  const news = await localGet<News[]>(key);
  return news ?? null;
}

export const LocalNewsRepository: NewsRepository = {
  ...DefaultNewsRepository,
  setNews,
  getNews,
};
