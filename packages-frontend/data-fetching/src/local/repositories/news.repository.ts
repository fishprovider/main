import { News } from '@fishprovider/core';
import { GetNewsFilter, NewsRepository, UpdateNewsPayload } from '@fishprovider/repositories';

import { buildNewsKeys, localGet, localSet } from '..';

const getNews = async (filter: GetNewsFilter) => {
  const key = buildNewsKeys(filter);
  const news = await localGet<News[]>(key);
  return { docs: news };
};

const setNews = async (
  filter: GetNewsFilter,
  payload: UpdateNewsPayload,
) => {
  const key = buildNewsKeys(filter);
  const { news } = payload;
  await localSet(key, news);
  return { docs: news };
};

export const LocalNewsRepository: NewsRepository = {
  getNews,
  setNews,
};
