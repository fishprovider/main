import { NewsController } from '@fishprovider/adapter-backend';
import type { GetNewsUseCaseParams } from '@fishprovider/application-rules';
import type { UserSession } from '@fishprovider/enterprise-rules';
import { MongoNewsRepository } from '@fishprovider/framework-mongo';

const getNews = async (
  userSession: UserSession,
  params: GetNewsUseCaseParams,
) => NewsController(MongoNewsRepository, userSession).getNews(params);

export default getNews;
