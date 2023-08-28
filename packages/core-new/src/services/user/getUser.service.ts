import _ from 'lodash';

import {
  BaseError,
  type GetUserService,
  type IUserService,
  type Projection,
  RepositoryError,
  ServiceError,
  type User,
  UserError,
  type UserRepository,
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
  _service: IUserService,
  getRepo: () => UserRepository,
): GetUserService => async (params, userSession) => {
  if (!userSession._id) throw new BaseError(UserError.USER_ACCESS_DENIED);

  const { userId, email } = params;
  if (!(userId || email)) throw new BaseError(ServiceError.SERVICE_BAD_REQUEST);

  const projection = {
    ...getUserAllowReadFieldsProjection,
    ..._.pick(params.projection, getUserAllowReadFields),
  };

  const user = await getRepo().getUser({
    ...params,
    projection,
  });

  if (!user) {
    throw new BaseError(UserError.USER_NOT_FOUND);
  }

  if (!validateProjection(projection, user)) {
    throw new BaseError(RepositoryError.REPOSITORY_BAD_RESULT);
  }

  return user;
};
