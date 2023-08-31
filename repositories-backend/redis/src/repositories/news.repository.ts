import { type NewsRepository, RepositoryError } from '@fishprovider/core-new';

const getNews = async () => ({ docs: null });

const watchNews = () => {
  throw new Error(RepositoryError.REPOSITORY_BAD_RESULT);
};

export const RedisNewsRepository: NewsRepository = {
  getNews,
  watchNews,
};
