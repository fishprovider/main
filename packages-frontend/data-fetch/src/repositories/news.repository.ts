import { News } from '@fishprovider/core';
import { FishApiNewsRepository } from '@fishprovider/fish-api';
import { LocalNewsRepository } from '@fishprovider/local';
import { BaseGetOptions, NewsRepository } from '@fishprovider/repositories';
import { StoreNewsRepository } from '@fishprovider/store';

const getNews = async (
  filter: {
    today?: boolean,
    week?: string,
    upcoming?: boolean,
  },
  options?: BaseGetOptions<News>,
) => {
  const setNewsToLocal = async (news?: Partial<News>[]) => {
    if (LocalNewsRepository.updateNews) {
      await LocalNewsRepository.updateNews(filter, { news }, options);
    }
  };
  const setNewsToStore = async (news?: Partial<News>[]) => {
    if (StoreNewsRepository.updateNews) {
      await StoreNewsRepository.updateNews(filter, { news }, options);
    }
  };
  const setNews = async (news?: Partial<News>[]) => Promise.all([
    setNewsToLocal(news),
    setNewsToStore(news),
  ]);

  let docs;

  if (LocalNewsRepository.getNews) {
    const res = await LocalNewsRepository.getNews(filter, options);
    docs = res.docs;
    setNewsToStore(docs); // non-blocking
  }

  if (FishApiNewsRepository.getNews) {
    if (!docs) {
      const res = await FishApiNewsRepository.getNews(filter, options);
      docs = res.docs;
      setNews(docs); // non-blocking
    } else {
      FishApiNewsRepository.getNews(filter, options) // non-blocking
        .then((res) => setNews(res.docs));
    }
  }

  return { docs };
};

export const DataFetchNewsRepository: NewsRepository = {
  getNews,
  watchNews: StoreNewsRepository.watchNews,
};
