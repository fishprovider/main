import { DefaultNewsRepository, type GetNewsRepositoryParams, type NewsRepository } from '@fishprovider/application-rules';
import { FishApiNewsRepository } from '@fishprovider/framework-fish-api';
import { LocalNewsRepository } from '@fishprovider/framework-local';

async function getNews(params: GetNewsRepositoryParams) {
  let news = await LocalNewsRepository.getNews(params);
  const keys = Object.keys(params);
  if (!news) {
    news = await FishApiNewsRepository.getNews(params);
    // non-blocking
    LocalNewsRepository.setNews({ keys, news: news || [] });
  } else {
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
