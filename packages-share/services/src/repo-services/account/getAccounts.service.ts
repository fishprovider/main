import {
  AccountError, BaseError, GetAccountsService, RepositoryError,
} from '@fishprovider/core';

import {
  checkAccess, sanitizeAccountBaseGetOptions, validateProjection,
} from '../..';

export const getAccountsService: GetAccountsService = async ({
  filter, options: optionsRaw, repositories, context,
}) => {
  //
  // pre-check
  //
  if (!repositories.account.getAccounts) throw new BaseError(RepositoryError.REPOSITORY_NOT_IMPLEMENT);

  //
  // main
  //
  const options = sanitizeAccountBaseGetOptions(optionsRaw);

  const { docs: accounts } = await repositories.account.getAccounts(filter, options);
  if (!accounts) {
    throw new BaseError(AccountError.ACCOUNT_NOT_FOUND);
  }

  accounts.forEach((account) => {
    if (!validateProjection(options.projection, account)) {
      throw new BaseError(RepositoryError.REPOSITORY_BAD_RESULT);
    }

    checkAccess(account, context);
  });

  return { docs: accounts };
};
