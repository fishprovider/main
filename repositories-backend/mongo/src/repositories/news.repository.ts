import {
  GetNewsFilter, type News, type NewsRepository,
} from '@fishprovider/core-new';
import { getMongo } from '@fishprovider/libs';
import moment from 'moment';

const getNews = async (filter: GetNewsFilter) => {
  const { today, week, upcoming } = filter;
  const { db } = await getMongo();

  if (today) {
    const news = await db.collection<News>('news').find({
      datetime: {
        $gte: new Date(),
        $lte: moment().add(24, 'hours').toDate(),
      },
    }).toArray();
    return { docs: news };
  }

  if (week) {
    const news = await db.collection<News>('news').find({
      week,
    }).toArray();
    return { docs: news };
  }

  if (upcoming) {
    const news = await db.collection<News>('news').find({
      impact: { $in: ['high', 'medium'] },
      datetime: {
        $gte: moment().subtract(1, 'hour').toDate(),
        $lte: moment().add(1, 'hour').toDate(),
      },
    }).toArray();
    return { docs: news };
  }

  return { docs: null };
};

export const MongoNewsRepository: NewsRepository = {
  getNews,
};
