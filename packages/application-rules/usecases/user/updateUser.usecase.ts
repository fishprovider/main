import type { User } from '@fishprovider/enterprise-rules';
import _ from 'lodash';

import type { UpdateUserRepositoryParams, UserRepository } from './_user.repository';

const updateUserAllowUpdateFields: Array<keyof User> = [
  'name',
  'picture',
  'starProviders',
];

export type UpdateUserUseCaseParams = UpdateUserRepositoryParams;

export type UpdateUserUseCase = (
  params: UpdateUserUseCaseParams
) => Promise<boolean>;

export const internalUpdateUserUseCase = (
  userRepository: UserRepository,
): UpdateUserUseCase => async (
  params: UpdateUserUseCaseParams,
) => {
  const res = await userRepository.updateUser(params);
  return res;
};

export const updateUserUseCase = (
  userRepository: UserRepository,
): UpdateUserUseCase => async (
  params: UpdateUserUseCaseParams,
) => {
  const { userId, payload } = params;

  const repositoryParams = {
    userId,
    payload: _.pick(payload, updateUserAllowUpdateFields),
  };
  return internalUpdateUserUseCase(userRepository)(repositoryParams);
};
