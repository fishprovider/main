import { BaseError, UserError } from '@fishprovider/core';
import { RepositoryError } from '@fishprovider/repositories';

import {
  GetUserService, sanitizeGetUserFilter, sanitizeUserBaseGetOptions, validateProjection,
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

  const filter = sanitizeGetUserFilter(filterRaw, userSession);
  const options = sanitizeUserBaseGetOptions(optionsRaw);

  const { doc: user } = await repositories.user.getUser(filter, options);

  if (!user) {
    throw new BaseError(UserError.USER_NOT_FOUND);
  }
  if (!validateProjection(options.projection, user)) {
    throw new BaseError(RepositoryError.REPOSITORY_BAD_RESULT, 'projection', user._id);
  }

  return { doc: user };
};
