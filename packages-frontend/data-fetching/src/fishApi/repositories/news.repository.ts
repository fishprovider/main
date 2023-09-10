import { News } from '@fishprovider/core';
import { GetNewsFilter, NewsRepository } from '@fishprovider/repositories';

import { fishApiGet } from '..';

const getNews = async (
  filter: GetNewsFilter,
) => {
  const news = await fishApiGet<Partial<News>[] | undefined>('/news/getNews', filter);
  return { docs: news };
};

export const FishApiNewsRepository: NewsRepository = {
  getNews,
};
