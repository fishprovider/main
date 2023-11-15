import { News } from '@fishprovider/core';
import { NewsRepository } from '@fishprovider/core-backend';

import { buildKeyNews, getRedis } from '..';

const getNews: NewsRepository['getNews'] = async (filter) => {
  const key = buildKeyNews(filter);
  const { clientJson } = await getRedis();
  const docs = await clientJson.get(key);
  if (!docs) return {};

  return { docs: docs as Partial<News>[] };
};

const updateNews: NewsRepository['updateNews'] = async (filter, payload) => {
  const key = buildKeyNews(filter);
  const { client, clientJson } = await getRedis();
  const { news } = payload;
  if (news) {
    await clientJson.set(key, '.', news);
    await client.expire(key, 60 * 60 * 4);
  }
  return { docs: news };
};

export const RedisNewsRepository: NewsRepository = {
  getNews,
  updateNews,
};
