import { BaseError, RepositoryError, SetNewsService } from '@fishprovider/core-new';

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
