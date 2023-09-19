import { BaseError } from '@fishprovider/core';
import { RepositoryError } from '@fishprovider/repositories';

import { UpdateNewsService } from '../..';

export const updateNewsService: UpdateNewsService = async ({
  filter, payload, options, repositories,
}) => {
  //
  // pre-check
  //
  if (!repositories.news.updateNews) throw new BaseError(RepositoryError.REPOSITORY_NOT_IMPLEMENT);

  //
  // main
  //
  return repositories.news.updateNews(filter, payload, options);
};
