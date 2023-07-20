import type { User } from '@fishprovider/enterprise-rules';
import _ from 'lodash';

import type { UserRepository } from './user.repository';

export type UpdateUserAdminUseCasePayload = Partial<User>;

export interface UpdateUserAdminUseCaseParams {
  userId: string,
  payload: UpdateUserAdminUseCasePayload,
}

export type UpdateUserAdminUseCase = (params: UpdateUserAdminUseCaseParams) => Promise<boolean>;

export const updateUserAdminUseCase = (
  userRepository: UserRepository,
): UpdateUserAdminUseCase => async (
  params: UpdateUserAdminUseCaseParams,
) => {
  const { userId, payload } = params;
  const res = await userRepository.updateUser({
    userId,
    payload,
  });
  return res;
};
