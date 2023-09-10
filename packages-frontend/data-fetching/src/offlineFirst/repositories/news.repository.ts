import { News } from '@fishprovider/core';
import {
  BaseGetOptions, GetNewsFilter, NewsRepository,
} from '@fishprovider/repositories';

import { FishApiNewsRepository, LocalNewsRepository, StoreNewsRepository } from '../..';

const getNews = async (
  filter: GetNewsFilter,
  options: BaseGetOptions<News>,
) => {
  let docs;
  if (LocalNewsRepository.getNews) {
    const res = await LocalNewsRepository.getNews(filter, options);
    docs = res.docs;
  }

  if (FishApiNewsRepository.getNews) {
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

    if (!docs) {
      const res = await FishApiNewsRepository.getNews(filter, options);
      docs = res.docs;

      // non-blocking
      setNews(docs);
    } else {
      // non-blocking
      FishApiNewsRepository.getNews(filter, options).then((res) => {
        setNews(res.docs);
      });
    }
  }

  return { docs };
};

export const OfflineFirstNewsRepository: NewsRepository = {
  getNews,
};
