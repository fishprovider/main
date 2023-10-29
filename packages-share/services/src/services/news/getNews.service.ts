import { checkRepository, GetNewsService } from '@fishprovider/core';

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
