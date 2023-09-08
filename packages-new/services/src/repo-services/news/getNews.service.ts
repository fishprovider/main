import { BaseError, GetNewsService, RepositoryError } from '@fishprovider/core-new';

export const getNewsService: GetNewsService = async ({
  filter, options, repositories,
}) => {
  //
  // pre-check
  //
  if (!repositories.news.getNews) throw new BaseError(RepositoryError.REPOSITORY_NOT_IMPLEMENT);

  //
  // main
  //
  return repositories.news.getNews(filter, options);
};
