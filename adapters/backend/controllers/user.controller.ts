import {
  getUserUseCase, updateUserUseCase, UpdateUserUseCaseParams, UserRepository,
} from '@fishprovider/application-rules';
import type { UserSession } from '@fishprovider/enterprise-rules';

export const UserController = (
  userRepository: UserRepository,
  userSession: UserSession,
) => ({
  getUser: async () => {
    const user = await getUserUseCase(userRepository, userSession);
    return user;
  },
  updateUser: async (params: UpdateUserUseCaseParams) => {
    const res = await updateUserUseCase(userRepository, userSession, params);
    return res;
  },
});
