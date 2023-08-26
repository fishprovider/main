import {
  type GetUserRepositoryParams,
  type Projection,
  type User,
  UserError,
} from '@fishprovider/models';
import _ from 'lodash';

import { UserService } from '.';

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

export const getUserUseCase = ({
  userRepository,
}: UserService) => async (params: GetUserUseCaseParams) => {
  const { projection } = params;

  const repositoryParams = {
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
