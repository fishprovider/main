import { NewsController } from '@fishprovider/adapter-backend';
import type { GetNewsUseCaseParams } from '@fishprovider/application-rules';
import type { UserSession } from '@fishprovider/enterprise-rules';
import { MongoNewsRepository } from '@fishprovider/framework-mongo';

const getNews = async (
  userSession: UserSession,
  params: GetNewsUseCaseParams,
) => {
  const news = await NewsController(MongoNewsRepository, userSession).getNews(params);
  return news;
};

export default getNews;
