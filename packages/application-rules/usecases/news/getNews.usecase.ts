import type { News } from '@fishprovider/enterprise-rules';

import type { GetNewsRepositoryParams, NewsRepository } from './news.repository';

export type GetNewsUseCasePayload = GetNewsRepositoryParams;

export interface GetNewsUseCaseParams {
  payload: GetNewsUseCasePayload,
}

export type GetNewsUseCase = (params: GetNewsUseCaseParams) => Promise<News[]>;

export const getNewsUseCase = (
  newsRepository: NewsRepository,
): GetNewsUseCase => async (
  params: GetNewsUseCaseParams,
) => {
  const { payload } = params;
  const news = await newsRepository.getNews(payload);
  return news || [];
};
