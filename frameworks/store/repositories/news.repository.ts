import type { GetNewsRepositoryParams, NewsRepository, SetNewsRepositoryParams } from '@fishprovider/application-rules';

import { storeNews } from '~stores';

async function setNews(params: SetNewsRepositoryParams) {
  storeNews.mergeDocs(params.news);
  return true;
}

async function getNews<T>(params: GetNewsRepositoryParams<T>) {
  const { useSelector } = params;
  if (useSelector) {
    return storeNews.useStore<T>(useSelector);
  }
  return Object.values(storeNews.getState());
}

export const StoreNewsRepository: NewsRepository = {
  setNews,
  getNews,
};
