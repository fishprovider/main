import {
  BaseGetOptions, GetNewsFilter, News, NewsRepository,
} from '@fishprovider/core';
import { MongoNewsRepository } from '@fishprovider/mongo';
import { RedisNewsRepository } from '@fishprovider/redis';

const getNews = async (filter: GetNewsFilter, options: BaseGetOptions<News>) => {
  let docs;
  if (RedisNewsRepository.getNews) {
    const res = await RedisNewsRepository.getNews(filter, options);
    docs = res.docs;
  }
  if (!docs && MongoNewsRepository.getNews) {
    const res = await MongoNewsRepository.getNews(filter, options);
    docs = res.docs;
    // non-blocking
    if (RedisNewsRepository.setNews) {
      RedisNewsRepository.setNews(filter, { news: docs ?? undefined }, options);
    }
  }
  return { docs };
};

export const CacheFirstNewsRepository: NewsRepository = {
  getNews,
};
