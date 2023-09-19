import { News } from '@fishprovider/core';
import { MongoNewsRepository } from '@fishprovider/mongo';
import { RedisNewsRepository } from '@fishprovider/redis';
import {
  BaseGetOptions, NewsRepository,
} from '@fishprovider/repositories';

const getNews = async (
  filter: {
    today?: boolean,
    week?: string,
    upcoming?: boolean,
  },
  options?: BaseGetOptions<News>,
) => {
  let docs;
  if (RedisNewsRepository.getNews) {
    const res = await RedisNewsRepository.getNews(filter, options);
    docs = res.docs;
  }
  if (!docs && MongoNewsRepository.getNews) {
    const res = await MongoNewsRepository.getNews(filter, options);
    docs = res.docs;
    if (RedisNewsRepository.updateNews) {
      RedisNewsRepository.updateNews(filter, { news: docs ?? undefined }, options); // non-blocking
    }
  }
  return { docs };
};

export const CacheFirstNewsRepository: NewsRepository = {
  getNews,
};
