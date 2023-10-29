import { NewsRepository } from '@fishprovider/core-backend';

const getNews: NewsRepository['getNews'] = async () => ({});

export const RedisNewsRepository: NewsRepository = {
  getNews,
};
