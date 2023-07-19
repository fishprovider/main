import { NewsController, UserSession } from '@fishprovider/adapter-backend';
import { MongoNewsRepository } from '@fishprovider/framework-mongo';

const getNews = async ({ userSession, data } : {
  userSession: UserSession,
  data: any,
}) => NewsController(MongoNewsRepository, userSession).getNews(data);

export default getNews;
