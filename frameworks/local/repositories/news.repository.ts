import {
  DefaultNewsRepository,
  type GetNewsRepositoryParams,
  type NewsRepository,
  type SetNewsRepositoryParams,
} from '@fishprovider/application-rules';
import type { News } from '@fishprovider/enterprise-rules';

import { local } from '../local.framework';

export const buildSetNewsKeys = (params: GetNewsRepositoryParams) => {
  const keys = Object.entries(params).map(([key, value]) => `${key}-${value}`);
  return keys;
};

async function setNews(params: SetNewsRepositoryParams) {
  const { keys, news } = params;
  const key = `news-${keys?.join('-')}`;
  const { localSet } = await local.get();
  await localSet(key, news);
  return true;
}

async function getNews(params: GetNewsRepositoryParams) {
  const keys = buildSetNewsKeys(params);
  const key = `news-${keys.join('-')}`;
  const { localGet } = await local.get();
  const news = await localGet<News[]>(key);
  return news;
}

export const LocalNewsRepository: NewsRepository = {
  ...DefaultNewsRepository,
  setNews,
  getNews,
};
