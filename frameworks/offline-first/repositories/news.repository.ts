import { DefaultNewsRepository, type GetNewsRepositoryParams, type NewsRepository } from '@fishprovider/application-rules';
import { FishApiNewsRepository } from '@fishprovider/framework-fish-api';
import { LocalNewsRepository } from '@fishprovider/framework-local';

async function getNews(params: GetNewsRepositoryParams) {
  let news = await LocalNewsRepository.getNews(params);
  if (!news) {
    news = await FishApiNewsRepository.getNews(params);
  } else {
    // non-blocking
    FishApiNewsRepository.getNews(params).then((docs) => {
      LocalNewsRepository.setNews({ news: docs || [] });
    });
  }
  return news;
}

export const OfflineFirstNewsRepository: NewsRepository = {
  ...DefaultNewsRepository,
  getNews,
};
