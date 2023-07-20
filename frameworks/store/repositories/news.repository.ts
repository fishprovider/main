import {
  DefaultNewsRepository, type NewsRepository,
  type SetNewsRepositoryParams,
  type WatchNewsRepositoryParams,
} from '@fishprovider/application-rules';

import { storeNews } from '~stores';

async function setNews(params: SetNewsRepositoryParams) {
  storeNews.mergeDocs(params.news);
  return true;
}

async function getNews() {
  return Object.values(storeNews.getState());
}

function watchNews<T>(params: WatchNewsRepositoryParams<T>) {
  const { selector } = params;
  return storeNews.useStore<T>(selector);
}

export const StoreNewsRepository: NewsRepository = {
  ...DefaultNewsRepository,
  setNews,
  getNews,
  watchNews,
};
