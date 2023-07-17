import type { GetNewsParams, NewsRepository } from '@fishprovider/application-rules';
import type { NewsEntity } from '@fishprovider/enterprise-rules';

import { mongo } from './mongo';

export const MongoNewsRepository: NewsRepository = {
  getNews: async (params: GetNewsParams) => {
    const { db } = await mongo.get();
    const news = await db.collection<NewsEntity>('news').find(params).toArray();
    return news;
  },
};
