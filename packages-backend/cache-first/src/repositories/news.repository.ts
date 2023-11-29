import { News } from '@fishprovider/core';
import { BaseGetManyResult, NewsRepository } from '@fishprovider/core-backend';
import { MongoNewsRepository } from '@fishprovider/mongo';
import { RedisNewsRepository } from '@fishprovider/redis';

import { getCacheFirst } from '..';

const getNews: NewsRepository['getNews'] = async (filter, options) => {
  const getCache = RedisNewsRepository.getNews;
  const setCache = RedisNewsRepository.updateNews;
  const getDb = MongoNewsRepository.getNews;

  const res = await getCacheFirst<BaseGetManyResult<News>>({
    getCache: getCache && (() => getCache(filter, options)),
    setCache: setCache && (({ docs } = {}) => setCache(filter, { news: docs }, options)),
    getDb: getDb && (() => getDb(filter, options)),
  });

  return res ?? {};
};

export const CacheFirstNewsRepository: NewsRepository = {
  ...RedisNewsRepository,
  ...MongoNewsRepository,
  getNews,
};
