import { News } from '@fishprovider/core';
import { BaseGetManyResult, NewsRepository } from '@fishprovider/core-frontend';
import { FishApiNewsRepository } from '@fishprovider/fish-api';
import { LocalNewsRepository } from '@fishprovider/local';
import { StoreNewsRepository } from '@fishprovider/store';

import { getDocs } from '..';

const getNews: NewsRepository['getNews'] = async (filter, options) => {
  const getDocsLocal = LocalNewsRepository.getNews;
  const setDocsLocal = LocalNewsRepository.updateNews;
  const setDocsStore = StoreNewsRepository.updateNews;
  const getDocsApi = FishApiNewsRepository.getNews;

  const res = await getDocs<BaseGetManyResult<News>>({
    getDocsLocal: getDocsLocal && (() => getDocsLocal(filter, options)),
    setDocsLocal: setDocsLocal && (({ docs }) => setDocsLocal(filter, { news: docs }, options)),
    setDocsStore: setDocsStore && (({ docs }) => setDocsStore(filter, { news: docs }, options)),
    getDocsApi: getDocsApi && (() => getDocsApi(filter, options)),
  });

  return res ?? {};
};

export const DataFetchNewsRepository: NewsRepository = {
  ...FishApiNewsRepository,
  getNews,
  watchNews: StoreNewsRepository.watchNews,
};
