import type { User } from '@fishprovider/enterprise-rules';
import _ from 'lodash';

import type { UserRepository } from './user.repository';

export const updateUserAllowEditFields: Array<keyof User> = [
  'name',
  'picture',
  'starProviders',
];
export type UpdateUserAllowEditFields = typeof updateUserAllowEditFields[number];

export type UpdateUserUseCasePayload = Partial<Pick<User, UpdateUserAllowEditFields>>;

export interface UpdateUserUseCaseParams {
  userRepository: UserRepository,
  userId: string,
  payload: UpdateUserUseCasePayload,
}

export const updateUserUseCase = async (params: UpdateUserUseCaseParams) => {
  const { userRepository, userId, payload } = params;
  const res = await userRepository.updateUser({
    userId,
    payload: _.pick(payload, updateUserAllowEditFields),
  });
  return res;
};
