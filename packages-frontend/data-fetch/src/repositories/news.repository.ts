import { News, NewsRepository } from '@fishprovider/core';
import { FishApiNewsRepository } from '@fishprovider/fish-api';
import { LocalNewsRepository } from '@fishprovider/local';
import { StoreNewsRepository } from '@fishprovider/store';

import { getDocs } from '..';

const getNews: NewsRepository['getNews'] = async (filter, options) => {
  const getDocsLocal = LocalNewsRepository.getNews;
  const setDocsLocal = LocalNewsRepository.updateNews;
  const setDocsStore = StoreNewsRepository.updateNews;
  const getDocsApi = FishApiNewsRepository.getNews;

  const docs = await getDocs<Partial<News>>({
    getDocsLocal: getDocsLocal && (() => getDocsLocal(filter, options).then((res) => res.docs)),
    setDocsLocal: setDocsLocal && ((news) => setDocsLocal(filter, { news }, options)),
    setDocsStore: setDocsStore && ((news) => setDocsStore(filter, { news }, options)),
    getDocsApi: getDocsApi && (() => getDocsApi(filter, options).then((res) => res.docs)),
  });

  return { docs };
};

export const DataFetchNewsRepository: NewsRepository = {
  getNews,
  watchNews: StoreNewsRepository.watchNews,
};
