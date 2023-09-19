import { AccountError, BaseError } from '@fishprovider/core';
import { RepositoryError } from '@fishprovider/repositories';

import {
  checkAccess, GetAccountService, sanitizeAccountBaseGetOptions, validateProjection,
} from '../..';

export const getAccountService: GetAccountService = async ({
  filter, options: optionsRaw, repositories, context,
}) => {
  //
  // pre-check
  //
  if (!repositories.account.getAccount) throw new BaseError(RepositoryError.REPOSITORY_NOT_IMPLEMENT);

  //
  // main
  //
  const options = sanitizeAccountBaseGetOptions(optionsRaw);

  const { doc: account } = await repositories.account.getAccount(filter, options);
  if (!account) {
    throw new BaseError(AccountError.ACCOUNT_NOT_FOUND);
  }
  if (!validateProjection(options?.projection, account)) {
    throw new BaseError(RepositoryError.REPOSITORY_INVALID_PROJECTION);
  }
  checkAccess(account, context);

  return { doc: account };
};
