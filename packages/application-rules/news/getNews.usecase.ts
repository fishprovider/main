import { UserError, UserSession } from '@fishprovider/enterprise-rules';

import type { GetNewsRepositoryParams, NewsRepository } from './news.repository';

export type GetNewsUseCasePayload = GetNewsRepositoryParams;

export interface GetNewsUseCaseParams {
  newsRepository: NewsRepository,
  userSession: UserSession,
  payload: GetNewsUseCasePayload,
}

export const getNewsUseCase = async (params: GetNewsUseCaseParams) => {
  const { newsRepository, userSession, payload } = params;
  if (!userSession) {
    throw new Error(UserError.USER_ACCESS_DENIED);
  }

  const news = await newsRepository.getNews(payload);
  return news;
};
