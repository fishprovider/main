import { BaseError, RepositoryError, WatchNewsService } from '@fishprovider/core';

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
