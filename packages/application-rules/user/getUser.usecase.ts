import { UserError, UserSession } from '@fishprovider/enterprise-rules';

import type { UserRepository } from './user.repository';

export const getUserUseCase = async (
  userRepository: UserRepository,
  userSession: UserSession,
) => {
  if (!userSession) {
    throw new Error(UserError.USER_ACCESS_DENIED);
  }

  const user = await userRepository.getUser({
    _id: userSession._id,
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
