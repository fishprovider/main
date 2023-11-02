import { News } from '@fishprovider/core';
import { BaseGetManyResult, NewsRepository } from '@fishprovider/core-backend';
import { MongoNewsRepository } from '@fishprovider/mongo';
import { RedisNewsRepository } from '@fishprovider/redis';

import { getDocs } from '..';

const getNews: NewsRepository['getNews'] = async (filter, options) => {
  const getDocsCache = RedisNewsRepository.getNews;
  const setDocsCache = RedisNewsRepository.updateNews;
  const getDocsDb = MongoNewsRepository.getNews;

  const res = await getDocs<BaseGetManyResult<News>>({
    getDocsCache: getDocsCache && (() => getDocsCache(filter, options)),
    setDocsCache: setDocsCache && (({ docs }) => setDocsCache(filter, { news: docs }, options)),
    getDocsDb: getDocsDb && (() => getDocsDb(filter, options)),
  });

  return res ?? {};
};

export const DataAccessNewsRepository: NewsRepository = {
  getNews,
};
