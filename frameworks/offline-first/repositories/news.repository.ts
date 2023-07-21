import {
  buildSetNewsKeys, DefaultNewsRepository, type GetNewsRepositoryParams, type NewsRepository,
} from '@fishprovider/application-rules';
import { FishApiNewsRepository } from '@fishprovider/framework-fish-api';
import { LocalNewsRepository } from '@fishprovider/framework-local';
import { StoreNewsRepository } from '@fishprovider/framework-store';

async function getNews(params: GetNewsRepositoryParams) {
  let news = await LocalNewsRepository.getNews(params);
  const key = buildSetNewsKeys(params);
  if (!news) {
    news = await FishApiNewsRepository.getNews(params);
    // non-blocking
    LocalNewsRepository.setNews({ news: news || [], key });
  } else {
    StoreNewsRepository.setNews({ news });
    // non-blocking
    FishApiNewsRepository.getNews(params).then((res) => {
      LocalNewsRepository.setNews({ news: res || [], key });
    });
  }
  return news;
}

export const OfflineFirstNewsRepository: NewsRepository = {
  ...DefaultNewsRepository,
  getNews,
};
