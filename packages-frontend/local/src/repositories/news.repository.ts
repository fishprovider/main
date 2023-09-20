import { News } from '@fishprovider/core';
import { NewsRepository } from '@fishprovider/repositories';

import { buildNewsKeys, localGet, localSet } from '..';

const getNews = async (filter: {
  today?: boolean,
  week?: string,
  upcoming?: boolean,
}) => {
  const key = buildNewsKeys(filter);
  const news = await localGet<News[]>(key);
  return { docs: news };
};

const updateNews = async (
  filter: {
    today?: boolean,
    week?: string,
    upcoming?: boolean,
  },
  payload: {
    news?: Partial<News>[],
  },
) => {
  const key = buildNewsKeys(filter);
  const { news } = payload;
  await localSet(key, news);
  return { docs: news };
};

export const LocalNewsRepository: NewsRepository = {
  getNews,
  updateNews,
};
