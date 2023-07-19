import type { GetNewsRepositoryParams, NewsRepository } from '@fishprovider/application-rules';
import type { News } from '@fishprovider/enterprise-rules';

import { mongo } from './mongo.framework';

async function getNews(params: GetNewsRepositoryParams) {
  const { db } = await mongo.get();
  const news = await db.collection<News>('news').find(params).toArray();
  return news;
}

export const MongoNewsRepository: NewsRepository = {
  getNews,
};
