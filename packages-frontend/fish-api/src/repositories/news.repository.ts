import { News, NewsRepository } from '@fishprovider/core';

import { fishApiGet } from '..';

const getNews: NewsRepository['getNews'] = async (filter) => {
  const news = await fishApiGet<Partial<News>[] | undefined>('/news/getNews', filter);
  return { docs: news };
};

export const FishApiNewsRepository: NewsRepository = {
  getNews,
};
