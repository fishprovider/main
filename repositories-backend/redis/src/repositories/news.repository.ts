import { type NewsRepository } from '@fishprovider/core-new';

const getNews = async () => ({ docs: null });

export const RedisNewsRepository: NewsRepository = {
  getNews,
};
