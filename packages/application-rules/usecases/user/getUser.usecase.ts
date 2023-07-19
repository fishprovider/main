import type { UserRepository } from './user.repository';

export interface GetUserUseCaseParams {
  userRepository: UserRepository,
  userId: string,
}

export const getUserUseCase = async (params: GetUserUseCaseParams) => {
  const { userRepository, userId } = params;
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
