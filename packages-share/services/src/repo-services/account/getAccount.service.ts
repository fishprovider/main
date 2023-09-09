import {
  AccountError, BaseError, GetAccountService, RepositoryError, ServiceError,
} from '@fishprovider/core-new';

import {
  checkAccess, sanitizeAccountBaseGetOptions, validateProjection,
} from '../..';

export const getAccountService: GetAccountService = async ({
  filter, options: optionsRaw, repositories, context,
}) => {
  //
  // pre-check
  //
  const { accountId } = filter;
  if (!accountId) throw new BaseError(ServiceError.SERVICE_BAD_REQUEST);
  if (!repositories.account.getAccount) throw new BaseError(RepositoryError.REPOSITORY_NOT_IMPLEMENT);

  //
  // main
  //
  const options = sanitizeAccountBaseGetOptions(optionsRaw);

  const { doc: account } = await repositories.account.getAccount(filter, options);
  if (!account) {
    throw new BaseError(AccountError.ACCOUNT_NOT_FOUND);
  }
  if (!validateProjection(options.projection, account)) {
    throw new BaseError(RepositoryError.REPOSITORY_BAD_RESULT);
  }

  checkAccess(account, context);

  return { doc: account };
};
