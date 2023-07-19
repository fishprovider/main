import type { GetNewsRepositoryParams, NewsRepository } from '@fishprovider/application-rules';
import type { News } from '@fishprovider/enterprise-rules';
import moment from 'moment';

import { mongo } from './mongo.framework';

async function getNews(params: GetNewsRepositoryParams) {
  const { today, week, upcoming } = params;
  const { db } = await mongo.get();

  if (today) {
    const news = await db.collection<News>('news').find({
      datetime: {
        $gte: new Date(),
        $lte: moment().add(24, 'hours').toDate(),
      },
    }).toArray();
    return news;
  }

  if (week) {
    const news = await db.collection<News>('news').find({
      week,
    }).toArray();
    return news;
  }

  if (upcoming) {
    const news = await db.collection<News>('news').find({
      impact: { $in: ['high', 'medium'] },
      datetime: {
        $gte: moment().subtract(1, 'hour').toDate(),
        $lte: moment().add(1, 'hour').toDate(),
      },
    }).toArray();
    return news;
  }

  return [];
}

export const MongoNewsRepository: NewsRepository = {
  getNews,
};
