import {
  BaseGetOptions, GetNewsFilter, News, NewsRepository, RepositoryError,
} from '@fishprovider/core-new';
import { FishApiNewsRepository } from '@fishprovider/repository-fish-api';
// import { buildNewsKeys, LocalNewsRepository } from '@fishprovider/repository-local';
import { LocalNewsRepository } from '@fishprovider/repository-local';
// import { StoreNewsRepository } from '@fishprovider/repository-store';

const getNews = async (
  filter: GetNewsFilter,
  options: BaseGetOptions<News>,
) => {
  let news = await LocalNewsRepository.getNews(filter, options);
  // const key = buildNewsKeys(filter);
  if (!news) {
    news = await FishApiNewsRepository.getNews(filter, options);
    // non-blocking
    // LocalNewsRepository.setNews({ news: news || [], key });
  } else {
    // StoreNewsRepository.setNews({ news });
    // non-blocking
    FishApiNewsRepository.getNews(filter, options).then(() => {
      // LocalNewsRepository.setNews({ news: res || [], key });
    });
  }
  return news;
};

const watchNews = () => {
  throw new Error(RepositoryError.REPOSITORY_BAD_RESULT);
};

export const OfflineFirstNewsRepository: NewsRepository = {
  getNews,
  watchNews,
};
