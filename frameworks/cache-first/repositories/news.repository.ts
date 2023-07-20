import { DefaultNewsRepository, type GetNewsRepositoryParams, type NewsRepository } from '@fishprovider/application-rules';
import { MongoNewsRepository } from '@fishprovider/framework-mongo';
import { RedisNewsRepository } from '@fishprovider/framework-redis';

async function getNews(params: GetNewsRepositoryParams) {
  let news = await RedisNewsRepository.getNews(params);
  if (!news) {
    news = await MongoNewsRepository.getNews(params);
  }
  return news;
}

export const CacheFirstNewsRepository: NewsRepository = {
  ...DefaultNewsRepository,
  getNews,
};
