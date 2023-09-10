import { News } from '@fishprovider/core';
import {
  BaseGetOptions, GetNewsFilter, NewsRepository,
} from '@fishprovider/repositories';

import { MongoNewsRepository, RedisNewsRepository } from '../..';

const getNews = async (filter: GetNewsFilter, options: BaseGetOptions<News>) => {
  let docs;
  if (RedisNewsRepository.getNews) {
    const res = await RedisNewsRepository.getNews(filter, options);
    docs = res.docs;
  }
  if (!docs && MongoNewsRepository.getNews) {
    const res = await MongoNewsRepository.getNews(filter, options);
    docs = res.docs;
    if (RedisNewsRepository.setNews) {
      RedisNewsRepository.setNews(filter, { news: docs ?? undefined }, options); // non-blocking
    }
  }
  return { docs };
};

export const CacheFirstNewsRepository: NewsRepository = {
  getNews,
};
