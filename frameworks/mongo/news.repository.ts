import type { GetNewsRepositoryParams, NewsRepository } from '@fishprovider/application-rules';
import type { News } from '@fishprovider/enterprise-rules';

import { mongo } from './mongo';

export const MongoNewsRepository: NewsRepository = {
  getNews: async (params: GetNewsRepositoryParams) => {
    const { db } = await mongo.get();
    const news = await db.collection<News>('news').find(params).toArray();
    return news;
  },
};
