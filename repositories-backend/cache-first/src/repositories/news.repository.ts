import {
  BaseGetOptions, GetNewsFilter, News, NewsRepository,
} from '@fishprovider/core-new';
import { MongoNewsRepository } from '@fishprovider/repository-mongo';
import { RedisNewsRepository } from '@fishprovider/repository-redis';

const getNews = async (filter: GetNewsFilter, options: BaseGetOptions<News>) => {
  let docs = null;
  if (RedisNewsRepository.getNews) {
    const res = await RedisNewsRepository.getNews(filter, options);
    docs = res.docs;
  }
  if (!docs && MongoNewsRepository.getNews) {
    const res = await MongoNewsRepository.getNews(filter, options);
    docs = res.docs;
  }
  return { docs };
};

export const CacheFirstNewsRepository: NewsRepository = {
  getNews,
};
