import { News } from '@fishprovider/core';
import { NewsRepository } from '@fishprovider/core-frontend';
import { FishApiNewsRepository } from '@fishprovider/fish-api';
import { LocalNewsRepository } from '@fishprovider/local';
import { StoreNewsRepository } from '@fishprovider/store';

import { getDocs } from '..';

const getNews: NewsRepository['getNews'] = async (filter, options) => {
  const getDocsLocal = LocalNewsRepository.getNews;
  const setDocsLocal = LocalNewsRepository.updateNews;
  const setDocsStore = StoreNewsRepository.updateNews;
  const getDocsApi = FishApiNewsRepository.getNews;

  const news = await getDocs<Partial<News>>({
    getDocsLocal: getDocsLocal && (() => getDocsLocal(filter, options).then((res) => res.docs)),
    setDocsLocal: setDocsLocal && ((docs) => setDocsLocal(filter, { news: docs }, options)),
    setDocsStore: setDocsStore && ((docs) => setDocsStore(filter, { news: docs }, options)),
    getDocsApi: getDocsApi && (() => getDocsApi(filter, options).then((res) => res.docs)),
  });

  return { docs: news };
};

export const DataFetchNewsRepository: NewsRepository = {
  getNews,
  watchNews: StoreNewsRepository.watchNews,
};
