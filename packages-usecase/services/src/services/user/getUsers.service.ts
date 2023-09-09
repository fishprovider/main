import {
  BaseError, RepositoryError, UserError,
} from '@fishprovider/core';

import { GetUsersService } from '../..';

export const getUsersService: GetUsersService = async ({
  filter, options, repositories, context,
}) => {
  //
  // pre-check
  //
  if (!context?.userSession?.roles?.admin) throw new BaseError(UserError.USER_ACCESS_DENIED);
  if (!repositories.user.getUsers) throw new BaseError(RepositoryError.REPOSITORY_NOT_IMPLEMENT);

  //
  // main
  //
  const { docs: users } = await repositories.user.getUsers(filter, options);
  if (!users) {
    throw new BaseError(UserError.USER_NOT_FOUND);
  }

  return { docs: users };
};
