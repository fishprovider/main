import { NewsController } from '@fishprovider/adapter-backend';
import type { GetNewsParams } from '@fishprovider/application-rules';
import { MongoNewsRepository } from '@fishprovider/framework-mongo';

const newsGetNews = async (
  params: GetNewsParams,
) => {
  const newsController = NewsController(MongoNewsRepository);
  const news = await newsController.getNews(params);
  return news;
};

export default newsGetNews;
