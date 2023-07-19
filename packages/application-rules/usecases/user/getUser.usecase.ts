import type { User } from '@fishprovider/enterprise-rules';

import type { UserRepository } from './user.repository';

export interface GetUserUseCaseParams {
  userId: string,
}

export type GetUserUseCase = (params: GetUserUseCaseParams) => Promise<User>;

export const getUserUseCase = (
  userRepository: UserRepository,
): GetUserUseCase => async (
  params: GetUserUseCaseParams,
) => {
  const { userId } = params;
  const user = await userRepository.getUser({
    userId,
    projection: {
      email: 1,
      name: 1,
      picture: 1,

      roles: 1,
      starProviders: 1,

      telegram: 1,

      updatedAt: 1,
      createdAt: 1,
    },
  });
  return user;
};
