import {
  BaseError,
  type GetUserService,
  type IUserService,
  type Projection,
  RepositoryError,
  ServiceError,
  type User,
  UserError,
  validateProjection,
} from '../..';

export const getUser = (
  service: IUserService,
): GetUserService => async (params, userSession) => {
  if (!userSession._id) throw new BaseError(UserError.USER_ACCESS_DENIED);

  const { userId, email } = params;
  if (!(userId || email)) throw new BaseError(ServiceError.SERVICE_BAD_REQUEST);

  const projection: Projection<User> = {
    ...params.projection,
    pushNotif: 0,
  };

  const user = await service.repo.getUser({
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
