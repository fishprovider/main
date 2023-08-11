import { DefaultNewsRepository, type GetNewsRepositoryParams, type NewsRepository } from '@fishprovider/application';

const getNews = async (params: GetNewsRepositoryParams) => {
  console.log('TODO', params);
  return null;
};

export const RedisNewsRepository: NewsRepository = {
  ...DefaultNewsRepository,
  getNews,
};
