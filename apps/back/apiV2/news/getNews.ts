import { NewsController } from '@fishprovider/adapter-backend';
import { MongoNewsRepository } from '@fishprovider/framework-mongo';

import type { ApiHandlerParams } from '~types/api';

const getNews = async (
  { userSession, data }: ApiHandlerParams,
) => NewsController(MongoNewsRepository, userSession).getNews(data);

export default getNews;
