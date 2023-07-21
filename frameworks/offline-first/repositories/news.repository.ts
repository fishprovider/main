import { DefaultNewsRepository, type GetNewsRepositoryParams, type NewsRepository } from '@fishprovider/application-rules';
import { FishApiNewsRepository } from '@fishprovider/framework-fish-api';
import { buildSetNewsKeys, LocalNewsRepository } from '@fishprovider/framework-local';
import { StoreNewsRepository } from '@fishprovider/framework-store';

async function getNews(params: GetNewsRepositoryParams) {
  let news = await LocalNewsRepository.getNews(params);
  const keys = buildSetNewsKeys(params);
  if (!news) {
    news = await FishApiNewsRepository.getNews(params);
    // non-blocking
    LocalNewsRepository.setNews({ keys, news: news || [] });
  } else {
    StoreNewsRepository.setNews({ news });
    // non-blocking
    FishApiNewsRepository.getNews(params).then((res) => {
      LocalNewsRepository.setNews({ keys, news: res || [] });
    });
  }
  return news;
}

export const OfflineFirstNewsRepository: NewsRepository = {
  ...DefaultNewsRepository,
  getNews,
};
