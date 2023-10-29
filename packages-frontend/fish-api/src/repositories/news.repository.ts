import { News } from '@fishprovider/core';
import {
  NewsRepository,
} from '@fishprovider/core-frontend';

import { fishApiGet } from '..';

const getNews: NewsRepository['getNews'] = async (filter) => {
  const news = await fishApiGet<Partial<News>[] | undefined>('/news/getNews', filter);
  return { docs: news };
};

export const FishApiNewsRepository: NewsRepository = {
  getNews,
};
