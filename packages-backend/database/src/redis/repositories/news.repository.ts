import { NewsRepository } from '@fishprovider/repositories';

const getNews = async () => ({});

export const RedisNewsRepository: NewsRepository = {
  getNews,
};
