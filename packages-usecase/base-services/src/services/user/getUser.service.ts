import { BaseError, UserError } from '@fishprovider/core';

import {
  checkLogin, checkProjection, checkRepository, GetUserService,
  sanitizeGetUserFilter, sanitizeUserBaseGetOptions,
} from '../..';

export const getUserService: GetUserService = async ({
  filter: filterRaw, options: optionsRaw, repositories, context,
}) => {
  //
  // pre-check
  //
  const userSession = checkLogin(context?.userSession);
  const getUserRepo = checkRepository(repositories.user.getUser);

  //
  // main
  //
  const filter = sanitizeGetUserFilter(filterRaw, userSession);
  const options = sanitizeUserBaseGetOptions(optionsRaw);

  const { doc: user } = await getUserRepo(filter, options);
  if (!user) {
    throw new BaseError(UserError.USER_NOT_FOUND);
  }

  checkProjection(options?.projection, user);

  return {
    doc: {
      ...user,
      pushNotif: undefined, // never leak pushNotif
    },
  };
};
