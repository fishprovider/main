import { AccountError, AccountFull, BaseError } from '@fishprovider/core';
import { RepositoryError } from '@fishprovider/repositories';

import {
  checkAccess, GetBrokerAccountService, ServiceError, validateProjection,
} from '../..';

export const getBrokerAccountService: GetBrokerAccountService = async ({
  filter, options, repositories, context,
}) => {
  //
  // pre-check
  //
  const { accountId } = filter;
  if (!accountId) throw new BaseError(ServiceError.SERVICE_BAD_REQUEST);
  if (!repositories.account.getAccount) throw new BaseError(RepositoryError.REPOSITORY_NOT_IMPLEMENT);
  if (!repositories.broker.getAccount) throw new BaseError(RepositoryError.REPOSITORY_NOT_IMPLEMENT);

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
  const { doc: brokerAccount } = await repositories.account.getAccount({
    ...filter,
    config,
  }, options);
  if (!account) {
    throw new BaseError(AccountError.ACCOUNT_NOT_FOUND);
  }

  const accountPublic: Partial<AccountFull> = {
    ...account,
    ...brokerAccount,
  };
  delete accountPublic.config; // NEVER leak config to user

  return { doc: accountPublic };
};
