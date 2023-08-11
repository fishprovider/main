import { DefaultNewsRepository, type GetNewsRepositoryParams, type NewsRepository } from '@fishprovider/application';
import { MongoNewsRepository } from '@fishprovider/framework-mongo';
import { RedisNewsRepository } from '@fishprovider/framework-redis';

const getNews = async (params: GetNewsRepositoryParams) => {
  let news = await RedisNewsRepository.getNews(params);
  if (!news) {
    news = await MongoNewsRepository.getNews(params);
  }
  return news;
};

export const CacheFirstNewsRepository: NewsRepository = {
  ...DefaultNewsRepository,
  getNews,
};
