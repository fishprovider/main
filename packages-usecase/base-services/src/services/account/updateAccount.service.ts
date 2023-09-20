import { BaseError, UserError } from '@fishprovider/core';
import { RepositoryError } from '@fishprovider/repositories';

import {
  getAccountService, sanitizeAccountBaseGetOptions,
  UpdateAccountService, validateProjection,
} from '../..';

export const updateAccountService: UpdateAccountService = async ({
  filter, payload, options: optionsRaw, repositories, context,
}) => {
  //
  // pre-check
  //
  if (!context?.userSession?._id) throw new BaseError(UserError.USER_ACCESS_DENIED);
  if (!repositories.account.updateAccount) {
    throw new BaseError(RepositoryError.REPOSITORY_NOT_IMPLEMENT);
  }

  await getAccountService({
    filter,
    options: {
      projection: { _id: 1 },
    },
    repositories,
    context,
  });

  //
  // main
  //
  const options = sanitizeAccountBaseGetOptions(optionsRaw);
  const { doc: account } = await repositories.account.updateAccount(filter, payload, options);

  if (!validateProjection(options?.projection, account)) {
    throw new BaseError(RepositoryError.REPOSITORY_INVALID_PROJECTION);
  }

  return { doc: account };
};
