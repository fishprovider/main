import { NewsRepository } from '@fishprovider/core';

const getNews: NewsRepository['getNews'] = async () => ({});

export const RedisNewsRepository: NewsRepository = {
  getNews,
};
