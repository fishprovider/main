import {
  buildSetNewsKeys,
  DefaultNewsRepository,
  type GetNewsRepositoryParams,
  type NewsRepository,
  type SetNewsRepositoryParams,
} from '@fishprovider/application';
import type { News } from '@fishprovider/models';

import { local } from '../local.framework';

const setNews = async (params: SetNewsRepositoryParams) => {
  const { news, key = 'news' } = params;
  const { localSet } = await local.get();
  await localSet(key, news);
  return true;
};

const getNews = async (params: GetNewsRepositoryParams) => {
  const key = buildSetNewsKeys(params);
  const { localGet } = await local.get();
  const news = await localGet<News[]>(key);
  return news ?? null;
};

export const LocalNewsRepository: NewsRepository = {
  ...DefaultNewsRepository,
  setNews,
  getNews,
};
