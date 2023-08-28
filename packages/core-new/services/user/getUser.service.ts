import _ from 'lodash';

import {
  type GetUserService,
  type IUserService,
  type Projection,
  RepositoryError,
  ServiceError,
  type User,
  UserError,
  validateProjection,
} from '../..';

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

export const getUser = (
  service: IUserService,
): GetUserService => async (params) => {
  const { userId, email } = params;
  if (!(userId || email)) throw new Error(ServiceError.BAD_REQUEST);

  const projection = {
    ...getUserAllowReadFieldsProjection,
    ..._.pick(params.projection, getUserAllowReadFields),
  };

  const RepoParams = {
    ...params,
    projection,
  };

  const user = await service.repo.getUser(RepoParams);

  if (!user) {
    throw new Error(UserError.USER_NOT_FOUND);
  }

  if (!validateProjection(projection, user)) {
    throw new Error(RepositoryError.BAD_RESULT);
  }

  return user;
};
