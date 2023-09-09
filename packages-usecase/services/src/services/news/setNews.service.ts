import { BaseError, RepositoryError } from '@fishprovider/core';

import { SetNewsService } from '../..';

export const setNewsService: SetNewsService = async ({
  filter, payload, options, repositories,
}) => {
  //
  // pre-check
  //
  if (!repositories.news.setNews) throw new BaseError(RepositoryError.REPOSITORY_NOT_IMPLEMENT);

  //
  // main
  //
  return repositories.news.setNews(filter, payload, options);
};
