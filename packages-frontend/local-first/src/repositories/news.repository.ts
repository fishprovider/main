import { News } from '@fishprovider/core';
import { NewsRepository, RepositoryGetManyResult } from '@fishprovider/core-frontend';
import { FishApiNewsRepository } from '@fishprovider/fish-api';
import { LocalNewsRepository } from '@fishprovider/local';

import { getLocalFirst } from '..';

const getNews: NewsRepository['getNews'] = async (filter, options) => {
  const getLocal = LocalNewsRepository.getNews;
  const setLocal = LocalNewsRepository.updateNews;
  const getApi = FishApiNewsRepository.getNews;

  const res = await getLocalFirst<RepositoryGetManyResult<News>>({
    getLocal: getLocal && (() => getLocal(filter, options)),
    setLocal: setLocal && (({ docs } = {}) => setLocal(filter, { news: docs }, options)),
    getApi: getApi && (() => getApi(filter, options)),
  });

  return res ?? {};
};

export const LocalFirstNewsRepository: NewsRepository = {
  ...LocalNewsRepository,
  ...FishApiNewsRepository,
  getNews,
};
