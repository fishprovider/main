import { News } from '@fishprovider/core';
import { NewsRepository } from '@fishprovider/core-frontend';
import _ from 'lodash';

import { buildKeyNews, localGet, localSet } from '..';

const getNews: NewsRepository['getNews'] = async (filterRaw) => {
  const filter = _.pick(filterRaw, ['today', 'week', 'upcoming']);
  if (_.isEmpty(filter)) return {};

  const key = buildKeyNews(filter);
  const news = await localGet<News[]>(key);
  return { docs: news };
};

const updateNews: NewsRepository['updateNews'] = async (filterRaw, payload) => {
  const filter = _.pick(filterRaw, ['today', 'week', 'upcoming']);
  if (_.isEmpty(filter)) return {};

  const key = buildKeyNews(filter);
  const { news } = payload;
  await localSet(key, news);
  return { docs: news };
};

export const LocalNewsRepository: NewsRepository = {
  getNews,
  updateNews,
};
