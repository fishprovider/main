import { checkRepository } from '@fishprovider/core';

import { GetNewsService, WatchNewsService } from '..';

export const getNewsService: GetNewsService = async ({
  filter, repositories, options,
}) => {
  const getNewsRepo = checkRepository(repositories.news.getNews);
  return getNewsRepo(filter, options);
};

export const watchNewsService: WatchNewsService = ({
  selector, repositories,
}) => {
  const watchNewsRepo = checkRepository(repositories.news.watchNews);
  return watchNewsRepo(selector);
};
