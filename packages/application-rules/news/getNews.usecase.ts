import type { UserSession } from '@fishprovider/enterprise-rules';

import type { GetNewsRepositoryParams, NewsRepository } from './news.repository';

export type GetNewsUseCasePayload = GetNewsRepositoryParams;

export interface GetNewsUseCaseParams {
  newsRepository: NewsRepository,
  userSession: UserSession,
  payload: GetNewsUseCasePayload,
}

export const getNewsUseCase = async (params: GetNewsUseCaseParams) => {
  const { newsRepository, payload } = params;
  const news = await newsRepository.getNews(payload);
  return news;
};
