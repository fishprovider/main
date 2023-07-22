import type { User } from '@fishprovider/enterprise-rules';
import _ from 'lodash';

import type { UpdateUserRepositoryParams, UserRepository } from './_user.repository';

const updateUserAllowUpdateFields: Array<keyof User> = [
  'name',
  'picture',
  'starProviders',
];

export interface UpdateUserUseCaseParams extends UpdateUserRepositoryParams {
  isInternal?: boolean;
}

export type UpdateUserUseCase = (
  params: UpdateUserUseCaseParams
) => Promise<Partial<User> | boolean>;

export const updateUserUseCase = (
  userRepository: UserRepository,
): UpdateUserUseCase => async (
  params: UpdateUserUseCaseParams,
) => {
  const {
    isInternal, userId, payload, returnDoc,
  } = params;

  const repositoryParams = isInternal ? params : {
    userId,
    payload: _.pick(payload, updateUserAllowUpdateFields),
    returnDoc,
  };

  const res = await userRepository.updateUser(repositoryParams);
  return res;
};
