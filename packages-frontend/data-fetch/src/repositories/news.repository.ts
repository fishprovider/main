import { News } from '@fishprovider/core';
import { FishApiNewsRepository } from '@fishprovider/fish-api';
import { LocalNewsRepository } from '@fishprovider/local';
import {
  BaseGetOptions, NewsRepository,
} from '@fishprovider/repositories';
import { StoreNewsRepository } from '@fishprovider/store';

const getNews = async (
  filter: {
    today?: boolean,
    week?: string,
    upcoming?: boolean,
  },
  options?: BaseGetOptions<News>,
) => {
  const setNews = async (news?: Partial<News>[]) => {
    const promises = [];
    if (LocalNewsRepository.updateNews) {
      promises.push(
        LocalNewsRepository.updateNews(filter, { news }, options),
      );
    }
    if (StoreNewsRepository.updateNews) {
      promises.push(
        StoreNewsRepository.updateNews(filter, { news }, options),
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

export const DataFetchNewsRepository: NewsRepository = {
  getNews,
  watchNews: StoreNewsRepository.watchNews,
};
