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
  let docs;
  if (LocalNewsRepository.getNews) {
    const res = await LocalNewsRepository.getNews(filter, options);
    docs = res.docs;
  }

  if (FishApiNewsRepository.getNews) {
    const set = async (news?: Partial<News>[]) => {
      if (LocalNewsRepository.setNews) {
        LocalNewsRepository.setNews(filter, { news }, options);
      }
      if (StoreNewsRepository.setNews) {
        StoreNewsRepository.setNews(filter, { news }, options);
      }
    };

    if (!docs) {
      const res = await FishApiNewsRepository.getNews(filter, options);
      docs = res.docs;

      // non-blocking
      set(docs);
    } else {
      // non-blocking
      FishApiNewsRepository.getNews(filter, options).then((res) => {
        set(res.docs);
      });
    }
  }

  return { docs };
};

export const OfflineFirstNewsRepository: NewsRepository = {
  getNews,
};
