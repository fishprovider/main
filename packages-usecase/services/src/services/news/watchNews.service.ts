import { BaseError, RepositoryError } from '@fishprovider/core';

import { WatchNewsService } from '../..';

export const watchNewsService: WatchNewsService = ({
  selector, repositories,
}) => {
  //
  // pre-check
  //
  if (!repositories.news.watchNews) throw new BaseError(RepositoryError.REPOSITORY_NOT_IMPLEMENT);

  //
  // main
  //
  return repositories.news.watchNews(selector);
};
