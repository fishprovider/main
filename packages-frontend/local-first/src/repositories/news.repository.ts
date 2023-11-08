import { News } from '@fishprovider/core';
import { BaseGetManyResult, NewsRepository } from '@fishprovider/core-frontend';
import { FishApiNewsRepository } from '@fishprovider/fish-api';
import { LocalNewsRepository } from '@fishprovider/local';
import { StoreNewsRepository } from '@fishprovider/store';

import { getLocalFirst } from '..';

const getNews: NewsRepository['getNews'] = async (filter, options) => {
  const setStore = StoreNewsRepository.updateNews;
  const getLocal = LocalNewsRepository.getNews;
  const setLocal = LocalNewsRepository.updateNews;
  const getApi = FishApiNewsRepository.getNews;

  const res = await getLocalFirst<BaseGetManyResult<News>>({
    getLocal: getLocal && (() => getLocal(filter, options)),
    setLocal: setLocal && (({ docs } = {}) => setLocal(filter, { news: docs }, options)),
    setStore: setStore && (({ docs } = {}) => setStore(filter, { news: docs }, options)),
    getApi: getApi && (() => getApi(filter, options)),
  });

  return res ?? {};
};

export const LocalFirstNewsRepository: NewsRepository = {
  ...FishApiNewsRepository,
  getNews,
  watchNews: StoreNewsRepository.watchNews,
};
