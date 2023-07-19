import type { GetNewsRepositoryParams, NewsRepository } from '@fishprovider/application-rules';

async function getNews(params: GetNewsRepositoryParams) {
  console.log('TODO', params);
  return undefined;
}

export const RedisNewsRepository: NewsRepository = {
  getNews,
};
