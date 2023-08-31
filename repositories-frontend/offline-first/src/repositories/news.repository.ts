import {
  BaseGetOptions, GetNewsFilter, News, NewsRepository,
} from '@fishprovider/core-new';
import { FishApiNewsRepository } from '@fishprovider/repository-fish-api';
import { LocalNewsRepository } from '@fishprovider/repository-local';
import { StoreNewsRepository } from '@fishprovider/repository-store';

const getNews = async (
  filter: GetNewsFilter,
  options: BaseGetOptions<News>,
) => {
  let docs = null;
  if (LocalNewsRepository.getNews) {
    const res = await LocalNewsRepository.getNews(filter, options);
    docs = res.docs;
  }

  if (!docs) {
    if (FishApiNewsRepository.getNews) {
      const res = await FishApiNewsRepository.getNews(filter, options);
      docs = res.docs;
      if (LocalNewsRepository.setNews) {
        // non-blocking
        LocalNewsRepository.setNews(filter, { news: docs ?? undefined }, options);
      }
    }
  }

  // non-blocking
  if (FishApiNewsRepository.getNews) {
    FishApiNewsRepository.getNews(filter, options).then((res) => {
      if (LocalNewsRepository.setNews) {
        LocalNewsRepository.setNews(filter, { news: res.docs ?? undefined }, options);
      }
    });
  }

  if (StoreNewsRepository.setNews) {
    StoreNewsRepository.setNews(filter, { news: docs ?? undefined }, options);
  }

  return { docs };
};

export const OfflineFirstNewsRepository: NewsRepository = {
  getNews,
};
