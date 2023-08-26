import {
  type GetUserParams,
  type Projection,
  ServiceError,
  type User,
  UserError,
} from '@fishprovider/models';
import _ from 'lodash';

import { UserService } from '.';

const getUserAllowReadFields: Array<keyof User> = [
  '_id',
  'email',
  'name',
  'picture',

  'roles',
  'starProviders',

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

export const getUser = (userService: UserService) => async (params: GetUserParams) => {
  const { userId, email } = params;
  if (!(userId || email)) throw new Error(ServiceError.BAD_REQUEST);

  const { userRepository } = userService;

  const projection = {
    ...getUserAllowReadFieldsProjection,
    ..._.pick(params.projection, getUserAllowReadFields),
  };

  const repositoryParams = {
    ...params,
    projection,
  };

  const user = await userRepository.getUser(repositoryParams);

  if (!user) {
    throw new Error(UserError.USER_NOT_FOUND);
  }

  if (!Object.entries(user).every(([key, value]) => {
    if (projection[key as keyof User] === 0) return value === undefined;
    if (projection[key as keyof User] === undefined) return false;
    return true;
  })) {
    throw new Error(UserError.USER_ACCESS_DENIED);
  }

  return user;
};
