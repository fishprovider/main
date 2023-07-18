import { UserError, UserSession } from '@fishprovider/enterprise-rules';

import type { UserRepository } from './user.repository';

export const getUserUseCase = async (
  userRepository: UserRepository,
  userSession: UserSession,
) => {
  if (!userSession) {
    throw new Error(UserError.USER_ACCESS_DENIED);
  }

  const user = await userRepository.getUser();
  return user;
};
