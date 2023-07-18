import { NewsController } from '@fishprovider/adapter-backend';
import type { GetNewsUseCaseParams } from '@fishprovider/application-rules';
import { MongoNewsRepository } from '@fishprovider/framework-mongo';

const getNews = async (params: GetNewsUseCaseParams) => {
  const news = await NewsController(MongoNewsRepository).getNews(params);
  return news;
};

export default getNews;
