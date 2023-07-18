import { type UserEntity, UserError } from '@fishprovider/enterprise-rules';

import type { GetNewsRepositoryParams, NewsRepository } from './news.repository';

export interface GetNewsUseCaseParams {
  getNewsRepositoryParams: GetNewsRepositoryParams,
  userEntity: UserEntity,
}

export const getNewsUseCase = async (
  newsRepository: NewsRepository,
  params: GetNewsUseCaseParams,
) => {
  const { getNewsRepositoryParams, userEntity } = params;

  if (!userEntity) {
    throw new Error(UserError.USER_ACCESS_DENIED);
  }

  return newsRepository.getNews(getNewsRepositoryParams);
};
