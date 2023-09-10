import { News } from '@fishprovider/core';
import {
  BaseGetOptions, GetNewsFilter, NewsRepository,
} from '@fishprovider/repositories';

import { FishApiNewsRepository, LocalNewsRepository, StoreNewsRepository } from '../..';

const getNews = async (
  filter: GetNewsFilter,
  options: BaseGetOptions<News>,
) => {
  const setNews = async (news?: Partial<News>[]) => {
    const promises = [];
    if (LocalNewsRepository.setNews) {
      promises.push(
        LocalNewsRepository.setNews(filter, { news }, options),
      );
    }
    if (StoreNewsRepository.setNews) {
      promises.push(
        StoreNewsRepository.setNews(filter, { news }, options),
      );
    }
    await Promise.all(promises);
  };

  let docs;
  if (LocalNewsRepository.getNews) {
    const res = await LocalNewsRepository.getNews(filter, options);
    docs = res.docs;
  }

  if (FishApiNewsRepository.getNews) {
    if (!docs) {
      const res = await FishApiNewsRepository.getNews(filter, options);
      docs = res.docs;
      setNews(docs); // non-blocking
    } else {
      FishApiNewsRepository.getNews(filter, options).then((res) => { // non-blocking
        setNews(res.docs);
      });
    }
  }

  return { docs };
};

export const OfflineFirstNewsRepository: NewsRepository = {
  getNews,
};
