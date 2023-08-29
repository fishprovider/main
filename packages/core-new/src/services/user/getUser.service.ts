import {
  BaseError,
  getProjectionBlacklist,
  type GetUserService,
  RepositoryError,
  UserError,
  validateProjection,
} from '../..';

export const getUser: GetUserService = async ({
  params, repositories, context,
}) => {
  if (!context?.userSession?._id) throw new BaseError(UserError.USER_ACCESS_DENIED);
  const { userSession } = context;

  const projection = getProjectionBlacklist({
    pushNotif: 0,
  }, params.projection);

  const user = await repositories.user.getUser({
    userId: userSession._id,
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
