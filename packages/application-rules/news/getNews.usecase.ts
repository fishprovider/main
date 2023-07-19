import { NewsError, UserError, UserSession } from '@fishprovider/enterprise-rules';

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

  const { today, week, upcoming } = payload;
  if (!(today || week || upcoming)) {
    throw new Error(NewsError.GET_NEWS_BAD_REQUEST);
  }

  const news = await newsRepository.getNews(payload);
  return news;
};
