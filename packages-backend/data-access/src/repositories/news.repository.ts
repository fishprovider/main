import { News } from '@fishprovider/core';
import { NewsRepository } from '@fishprovider/core-backend';
import { MongoNewsRepository } from '@fishprovider/mongo';
import { RedisNewsRepository } from '@fishprovider/redis';

import { getDocs } from '../helpers';

const getNews: NewsRepository['getNews'] = async (filter, options) => {
  const getDocsCache = RedisNewsRepository.getNews;
  const setDocsCache = RedisNewsRepository.updateNews;
  const getDocsDb = MongoNewsRepository.getNews;

  const news = await getDocs<Partial<News>>({
    getDocsCache: getDocsCache && (() => getDocsCache(filter, options).then((res) => res.docs)),
    setDocsCache: setDocsCache && ((docs) => setDocsCache(filter, { news: docs }, options)),
    getDocsDb: getDocsDb && (() => getDocsDb(filter, options).then((res) => res.docs)),
  });

  return { docs: news };
};

export const DataAccessNewsRepository: NewsRepository = {
  getNews,
};
