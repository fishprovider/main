import { AccountError, AccountFull, BaseError } from '@fishprovider/core';
import { RepositoryError } from '@fishprovider/repositories';

import {
  checkAccess, ReloadAccountService, ServiceError, validateProjection,
} from '../..';

export const reloadAccountService: ReloadAccountService = async ({
  filter, options, repositories, context,
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
  const { doc: account } = await repositories.account.getAccount(filter, options);
  if (!account) {
    throw new BaseError(AccountError.ACCOUNT_NOT_FOUND);
  }
  if (options.projection && !validateProjection(options.projection, account)) {
    throw new BaseError(RepositoryError.REPOSITORY_BAD_RESULT, 'projection', account._id);
  }

  checkAccess(account, context);

  const { config } = account as AccountFull;
  console.log('TODO: call broker', config);

  const accountPublic: Partial<AccountFull> = {
    ...account,
  };
  delete accountPublic.config; // NEVER leak config to user

  return { doc: accountPublic };
};
