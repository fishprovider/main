import {
  getUserUseCase, updateUserUseCase, UpdateUserUseCasePayload, UserRepository,
} from '@fishprovider/application-rules';
import { UserError, UserSession } from '@fishprovider/enterprise-rules';

const getUser = (userRepository: UserRepository, userSession: UserSession) => async () => {
  if (!userSession) {
    throw new Error(UserError.USER_ACCESS_DENIED);
  }

  const user = await getUserUseCase({ userRepository, userSession });
  return user;
};

const updateUser = (userRepository: UserRepository, userSession: UserSession) => async (
  payload: UpdateUserUseCasePayload,
) => {
  if (!userSession) {
    throw new Error(UserError.USER_ACCESS_DENIED);
  }

  const res = await updateUserUseCase({ userRepository, userSession, payload });
  return res;
};

export const UserController = (
  userRepository: UserRepository,
  userSession: UserSession,
) => ({
  getUser: getUser(userRepository, userSession),
  updateUser: updateUser(userRepository, userSession),
});
