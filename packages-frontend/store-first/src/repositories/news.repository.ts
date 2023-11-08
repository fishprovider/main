import { News } from '@fishprovider/core';
import { BaseGetManyResult, NewsRepository } from '@fishprovider/core-frontend';
import { LocalFirstNewsRepository } from '@fishprovider/local-first';
import { StoreNewsRepository } from '@fishprovider/store';

import { getStoreFirst } from '..';

const getNews: NewsRepository['getNews'] = async (filter, options) => {
  const getStore = StoreNewsRepository.getNews;
  const setStore = StoreNewsRepository.updateNews;
  const getLocal = LocalFirstNewsRepository.getNews;

  const res = await getStoreFirst<BaseGetManyResult<News>>({
    getStore: getStore && (() => getStore(filter, options)),
    setStore: setStore && (({ docs } = {}) => setStore(filter, { news: docs }, options)),
    getLocal: getLocal && (() => getLocal(filter, options)),
  });

  return res ?? {};
};

export const StoreFirstNewsRepository: NewsRepository = {
  ...StoreNewsRepository,
  ...LocalFirstNewsRepository,
  getNews,
};
