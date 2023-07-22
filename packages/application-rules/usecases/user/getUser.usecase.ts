import { type User, UserError } from '@fishprovider/enterprise-rules';
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

export type GetUserUseCaseParams = GetUserRepositoryParams;

export type GetUserUseCase = (
  params: GetUserUseCaseParams
) => Promise<Partial<User>>;

export const internalGetUserUseCase = (
  userRepository: UserRepository,
): GetUserUseCase => async (
  params: GetUserUseCaseParams,
) => {
  const user = await userRepository.getUser(params);
  if (!user) {
    throw new Error(UserError.USER_NOT_FOUND);
  }
  return user;
};

export const getUserUseCase = (
  userRepository: UserRepository,
): GetUserUseCase => async (
  params: GetUserUseCaseParams,
) => {
  const { projection } = params;

  const repositoryParams = {
    ...params,
    projection: {
      ...getUserAllowReadFieldsProjection,
      ..._.pick(projection, getUserAllowReadFields),
    },
  };
  return internalGetUserUseCase(userRepository)(repositoryParams);
};
