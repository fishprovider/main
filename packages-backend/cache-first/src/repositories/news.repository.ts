import { News } from '@fishprovider/core';
import { NewsRepository, RepositoryGetManyResult } from '@fishprovider/core-backend';
import { MongoNewsRepository } from '@fishprovider/mongo';
import { RedisNewsRepository } from '@fishprovider/redis';

import { getCacheFirst } from '..';

const getNews: NewsRepository['getNews'] = async (filter, options) => {
  const getCache = RedisNewsRepository.getNews;

  const res = await getCacheFirst<RepositoryGetManyResult<News>>({
    getCache: getCache && (() => getCache(filter, options)),
  });

  return res ?? {};
};

export const CacheFirstNewsRepository: NewsRepository = {
  ...RedisNewsRepository,
  ...MongoNewsRepository,
  getNews,
};
