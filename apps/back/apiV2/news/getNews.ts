import { NewsController } from '@fishprovider/adapter-backend';
import type { GetNewsUseCasePayload } from '@fishprovider/application-rules';
import type { UserSession } from '@fishprovider/enterprise-rules';
import { MongoNewsRepository } from '@fishprovider/framework-mongo';

const getNews = async ({ userSession, payload } : {
  userSession: UserSession,
  payload: GetNewsUseCasePayload,
}) => NewsController(MongoNewsRepository, userSession).getNews(payload);

export default getNews;
