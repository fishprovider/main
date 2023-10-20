import { News } from '@fishprovider/core';
import { NewsRepository } from '@fishprovider/repositories';

import { buildKeyNews, localGet, localSet } from '..';

const getNews: NewsRepository['getNews'] = async (filter) => {
  const key = buildKeyNews(filter);
  const news = await localGet<News[]>(key);
  return { docs: news };
};

const updateNews: NewsRepository['updateNews'] = async (filter, payload) => {
  const key = buildKeyNews(filter);
  const { news } = payload;
  await localSet(key, news);
  return { docs: news };
};

export const LocalNewsRepository: NewsRepository = {
  getNews,
  updateNews,
};
