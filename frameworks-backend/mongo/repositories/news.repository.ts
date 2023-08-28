import { DefaultNewsRepository, type GetNewsRepositoryParams, type NewsRepository } from '@fishprovider/application';
import type { News } from '@fishprovider/core-new';
import moment from 'moment';

import { mongo } from '../mongo.framework';

const getNews = async (params: GetNewsRepositoryParams) => {
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

  return null;
};

export const MongoNewsRepository: NewsRepository = {
  ...DefaultNewsRepository,
  getNews,
};
