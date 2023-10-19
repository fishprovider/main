import { NewsRepository } from '@fishprovider/repositories';

const getNews: NewsRepository['getNews'] = async () => ({});

export const RedisNewsRepository: NewsRepository = {
  getNews,
};
