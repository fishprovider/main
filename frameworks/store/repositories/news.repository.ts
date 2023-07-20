import type { NewsRepository, SetNewsRepositoryParams, UseNewsRepositoryParams } from '@fishprovider/application-rules';

import { storeNews } from '~stores';

async function setNews(params: SetNewsRepositoryParams) {
  storeNews.mergeDocs(params.news);
  return true;
}

async function getNews() {
  return Object.values(storeNews.getState());
}

function useNews<T>(params: UseNewsRepositoryParams<T>) {
  return storeNews.useStore((state) => params.query(state));
}

export const StoreNewsRepository: NewsRepository = {
  setNews,
  getNews,
  useNews,
};
