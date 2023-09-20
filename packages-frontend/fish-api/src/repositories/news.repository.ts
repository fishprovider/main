import { News } from '@fishprovider/core';
import { NewsRepository } from '@fishprovider/repositories';

import { fishApiGet } from '..';

const getNews = async (
  filter: {
    today?: boolean,
    week?: string,
    upcoming?: boolean,
  },
) => {
  const news = await fishApiGet<Partial<News>[] | undefined>('/news/getNews', filter);
  return { docs: news };
};

export const FishApiNewsRepository: NewsRepository = {
  getNews,
};
