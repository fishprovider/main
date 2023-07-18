import { UserError, UserSession } from '@fishprovider/enterprise-rules';

import type { GetNewsRepositoryParams, NewsRepository } from './news.repository';

export type GetNewsUseCaseParams = GetNewsRepositoryParams;

export const getNewsUseCase = async (
  newsRepository: NewsRepository,
  userSession: UserSession,
  params: GetNewsUseCaseParams,
) => {
  if (!userSession) {
    throw new Error(UserError.USER_ACCESS_DENIED);
  }

  const news = await newsRepository.getNews(params);
  return news;
};
