import type { News } from '@fishprovider/enterprise-rules';

import type { GetNewsRepositoryParams, NewsRepository } from './_news.repository';

export type GetNewsUseCaseParams = GetNewsRepositoryParams;

export type GetNewsUseCase = (params: GetNewsUseCaseParams) => Promise<News[]>;

export const getNewsUseCase = (
  newsRepository: NewsRepository,
): GetNewsUseCase => async (
  params: GetNewsUseCaseParams,
) => {
  const news = await newsRepository.getNews(params);
  return news || [];
};
