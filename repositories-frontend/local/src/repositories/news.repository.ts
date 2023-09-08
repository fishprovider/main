import {
  BaseUpdateOptions, GetNewsFilter, News, NewsRepository, UpdateNewsPayload,
} from '@fishprovider/core-new';

import { buildNewsKeys, local } from '..';

const getNews = async (filter: GetNewsFilter) => {
  const key = buildNewsKeys(filter);
  const { localGet } = await local.get();
  const news = await localGet<News[]>(key);
  return { docs: news ?? null };
};

const setNews = async (
  filter: GetNewsFilter,
  payload: UpdateNewsPayload,
  _options: BaseUpdateOptions<News>,
) => {
  const key = buildNewsKeys(filter);
  const { news } = payload;
  const { localSet } = await local.get();
  await localSet(key, news);
  return { docs: news ?? null };
};

export const LocalNewsRepository: NewsRepository = {
  getNews,
  setNews,
};
