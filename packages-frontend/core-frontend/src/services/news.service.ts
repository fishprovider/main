import { checkRepository } from '@fishprovider/core';

import { GetNewsService, WatchNewsService } from '..';

export const getNewsService: GetNewsService = async ({
  filter, repositories,
}) => {
  const getNewsRepo = checkRepository(repositories.news.getNews);
  return getNewsRepo(filter);
};

export const watchNewsService: WatchNewsService = ({
  selector, repositories,
}) => {
  const watchNewsRepo = checkRepository(repositories.news.watchNews);
  return watchNewsRepo(selector);
};
