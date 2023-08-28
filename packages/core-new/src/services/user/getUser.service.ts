import {
  BaseError,
  getProjectionBlacklist,
  type GetUserService,
  type IUserService,
  RepositoryError,
  ServiceError,
  UserError,
  validateProjection,
} from '../..';

export const getUser = (
  service: IUserService,
): GetUserService => async (params, userSession) => {
  const { userId, email } = params;
  if (!(userId || email)) throw new BaseError(ServiceError.SERVICE_BAD_REQUEST);
  if (userId !== userSession._id) throw new BaseError(UserError.USER_ACCESS_DENIED);

  const projection = getProjectionBlacklist({
    pushNotif: 0,
  }, params.projection);

  const user = await service.repo.getUser({
    ...params,
    projection,
  });

  if (!user) {
    throw new BaseError(UserError.USER_NOT_FOUND);
  }

  if (!validateProjection(projection, user)) {
    throw new BaseError(RepositoryError.REPOSITORY_BAD_RESULT, 'projection', user);
  }

  return user;
};
