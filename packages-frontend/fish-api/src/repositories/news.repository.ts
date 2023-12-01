import { News } from '@fishprovider/core';
import { NewsRepository } from '@fishprovider/core-frontend';

import { fishApiPost } from '..';

const getNews: NewsRepository['getNews'] = async (filter, options) => {
  const news = await fishApiPost<Partial<News>[] | undefined>('/news/getNews', { filter, options });
  return { docs: news };
};

export const FishApiNewsRepository: NewsRepository = {
  getNews,
};
