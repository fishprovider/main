import { checkRepository } from '@fishprovider/core';

import { GetNewsService } from '../..';

export const getNewsService: GetNewsService = async ({
  filter, options, repositories,
}) => {
  //
  // pre-check
  //
  const getNewsRepo = checkRepository(repositories.news.getNews);

  //
  // main
  //
  return getNewsRepo(filter, options);
};
