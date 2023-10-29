import { UpdateNewsService } from '@fishprovider/core';

import { checkRepository } from '../..';

export const updateNewsService: UpdateNewsService = async ({
  filter, payload, options, repositories,
}) => {
  //
  // pre-check
  //
  const updateNewsRepo = checkRepository(repositories.news.updateNews);

  //
  // main
  //
  return updateNewsRepo(filter, payload, options);
};
