import { User, UserError } from '@fishprovider/enterprise-rules';

import type { GetNewsRepositoryParams, NewsRepository } from './news.repository';

export interface GetNewsUseCaseParams {
  getNewsRepositoryParams: GetNewsRepositoryParams,
  user: User,
}

export const getNewsUseCase = async (
  newsRepository: NewsRepository,
  params: GetNewsUseCaseParams,
) => {
  const { getNewsRepositoryParams, user } = params;

  if (!user) {
    throw new Error(UserError.USER_ACCESS_DENIED);
  }

  return newsRepository.getNews(getNewsRepositoryParams);
};
