import { type User, UserError } from '@fishprovider/enterprise-rules';
import assert from 'assert';
import _ from 'lodash';

import type { Projection } from '~types';

import type { GetUserRepositoryParams, UserRepository } from './_user.repository';

const getUserAllowReadFields: Array<keyof User> = [
  'email',
  'name',
  'picture',
  'starProviders',
  'roles',

  'telegram',

  'updatedAt',
  'createdAt',
];

const getUserAllowReadFieldsProjection = getUserAllowReadFields.reduce<Projection<User>>(
  (acc, field) => {
    acc[field] = 1;
    return acc;
  },
  {},
);

export interface GetUserUseCaseParams extends GetUserRepositoryParams {
  isInternal?: boolean;
}

export type GetUserUseCase = (
  params: GetUserUseCaseParams
) => Promise<Partial<User>>;

export const getUserUseCase = (
  userRepository: UserRepository,
): GetUserUseCase => async (
  params: GetUserUseCaseParams,
) => {
  const { isInternal, projection } = params;
  assert(!isInternal || projection);

  const repositoryParams = isInternal ? params : {
    ...params,
    projection: {
      ...getUserAllowReadFieldsProjection,
      ..._.pick(projection, getUserAllowReadFields),
    },
  };

  const user = await userRepository.getUser(repositoryParams);
  if (!user) {
    throw new Error(UserError.USER_NOT_FOUND);
  }
  return user;
};
