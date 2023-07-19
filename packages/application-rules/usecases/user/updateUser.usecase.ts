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
  userId: string,
  payload: UpdateUserUseCasePayload,
}

export type UpdateUserUseCase = (params: UpdateUserUseCaseParams) => Promise<boolean>;

export const updateUserUseCase = (
  userRepository: UserRepository,
): UpdateUserUseCase => async (
  params: UpdateUserUseCaseParams,
) => {
  const { userId, payload } = params;
  const res = await userRepository.updateUser({
    userId,
    payload: _.pick(payload, updateUserAllowEditFields),
  });
  return res;
};
