import { NewsRepository } from '@fishprovider/core-backend';
import _ from 'lodash';

import { buildKeyNews, getRedis } from '..';

const getNews: NewsRepository['getNews'] = async (filterRaw) => {
  const filter = _.pick(filterRaw, ['today', 'week', 'upcoming']);
  if (_.isEmpty(filter)) return {};

  const key = buildKeyNews(filter);
  const { client } = await getRedis();
  const str = await client.get(key);
  if (!str) return {};

  return { docs: JSON.parse(str) };
};

const updateNews: NewsRepository['updateNews'] = async (filterRaw, payload) => {
  const filter = _.pick(filterRaw, ['today', 'week', 'upcoming']);
  if (_.isEmpty(filter)) return {};

  const key = buildKeyNews(filter);
  const { client } = await getRedis();
  const { news } = payload;
  await client.set(key, JSON.stringify(news), { EX: 60 * 60 });
  return { docs: news };
};

export const RedisNewsRepository: NewsRepository = {
  getNews,
  updateNews,
};
