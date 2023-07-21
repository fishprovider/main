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

export type UpdateUserUseCase = (params: UpdateUserUseCaseParams) => Promise<boolean>;

export const updateUserUseCase = (
  userRepository: UserRepository,
): UpdateUserUseCase => async (
  params: UpdateUserUseCaseParams,
) => {
  const { isInternal, payload, payloadDelete } = params;
  const repositoryParams = isInternal ? params : {
    ...params,
    payload: _.pick(payload, updateUserAllowUpdateFields),
    payloadDelete: _.pick(payloadDelete, updateUserAllowUpdateFields),
  };

  const res = await userRepository.updateUser(repositoryParams);
  return res;
};
