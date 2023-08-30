import {
  BaseError,
  getProjectionBlacklist,
  type GetUserService,
  RepositoryError,
  UserError,
  validateProjection,
} from '../..';

export const getUserService: GetUserService = async ({
  filter, repositories, context,
}) => {
  //
  // pre-check
  //
  if (!context?.userSession?._id) throw new BaseError(UserError.USER_ACCESS_DENIED);

  //
  // main
  //
  const { userSession } = context;

  const projection = getProjectionBlacklist({
    pushNotif: 0,
  }, filter.projection);

  const { doc: user } = await repositories.user.getUser({
    ...filter,
    userId: userSession._id,
    email: userSession.email,
    projection,
  });

  //
  // post-check
  //
  if (!user) {
    throw new BaseError(UserError.USER_NOT_FOUND);
  }

  if (!validateProjection(projection, user)) {
    throw new BaseError(RepositoryError.REPOSITORY_BAD_RESULT, 'projection', user);
  }

  return { doc: user };
};
