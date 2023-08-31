import {
  BaseGetOptions, GetNewsFilter, News, NewsRepository, RepositoryError,
} from '@fishprovider/core-new';
import { MongoNewsRepository } from '@fishprovider/repository-mongo';
import { RedisNewsRepository } from '@fishprovider/repository-redis';

const getNews = async (filter: GetNewsFilter, options: BaseGetOptions<News>) => {
  let news = await RedisNewsRepository.getNews(filter, options);
  if (!news) {
    news = await MongoNewsRepository.getNews(filter, options);
  }
  return news;
};

const watchNews = () => {
  throw new Error(RepositoryError.REPOSITORY_BAD_RESULT);
};

export const CacheFirstNewsRepository: NewsRepository = {
  getNews,
  watchNews,
};
