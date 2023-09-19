import { News } from '@fishprovider/core';
import { NewsRepository } from '@fishprovider/repositories';
import moment from 'moment';
import { Filter } from 'mongodb';

import { getMongo } from '..';

const buildNewsFilter = (filter: {
  today?: boolean,
  week?: string,
  upcoming?: boolean,
}): Filter<News> => {
  const { today, week, upcoming } = filter;
  return {
    ...(today && {
      datetime: {
        $gte: new Date(),
        $lte: moment().add(24, 'hours').toDate(),
      },
    }),
    ...(week && {
      week,
    }),
    ...(upcoming && {
      impact: { $in: ['high', 'medium'] },
      datetime: {
        $gte: moment().subtract(1, 'hour').toDate(),
        $lte: moment().add(1, 'hour').toDate(),
      },
    }),
  };
};

const getNews = async (filter: {
  today?: boolean,
  week?: string,
  upcoming?: boolean,
}) => {
  const { db } = await getMongo();
  const news = await db.collection<News>('news').find(
    buildNewsFilter(filter),
  ).toArray();
  return { docs: news };
};

export const MongoNewsRepository: NewsRepository = {
  getNews,
};
