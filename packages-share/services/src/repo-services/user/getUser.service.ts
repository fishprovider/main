import {
  BaseError, GetUserService, RepositoryError, UserError,
} from '@fishprovider/core';

import {
  sanitizeUserBaseGetOptions, sanitizeUserGetFilter, validateProjection,
} from '../..';

export const getUserService: GetUserService = async ({
  filter: filterRaw, options: optionsRaw, repositories, context,
}) => {
  //
  // pre-check
  //
  if (!context?.userSession?._id) throw new BaseError(UserError.USER_ACCESS_DENIED);
  if (!repositories.user.getUser) throw new BaseError(RepositoryError.REPOSITORY_NOT_IMPLEMENT);

  //
  // main
  //
  const { userSession } = context;

  const filter = sanitizeUserGetFilter(filterRaw, userSession);
  const options = sanitizeUserBaseGetOptions(optionsRaw);

  const { doc: user } = await repositories.user.getUser(filter, options);

  if (!user) {
    throw new BaseError(UserError.USER_NOT_FOUND);
  }
  if (!validateProjection(options.projection, user)) {
    throw new BaseError(RepositoryError.REPOSITORY_BAD_RESULT, 'projection', user);
  }

  return { doc: user };
};
