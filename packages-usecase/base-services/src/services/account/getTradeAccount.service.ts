import { AccountError, AccountFull, BaseError } from '@fishprovider/core';
import { RepositoryError } from '@fishprovider/repositories';

import {
  checkAccess, getAccountService, GetTradeAccountService,
} from '../..';

export const getTradeAccountService: GetTradeAccountService = async ({
  filter, repositories, context,
}) => {
  //
  // pre-check
  //
  if (!repositories.account.getAccount) {
    throw new BaseError(RepositoryError.REPOSITORY_NOT_IMPLEMENT);
  }
  if (!repositories.account.updateAccount) {
    throw new BaseError(RepositoryError.REPOSITORY_NOT_IMPLEMENT);
  }
  if (!repositories.trade.getAccount) {
    throw new BaseError(RepositoryError.REPOSITORY_NOT_IMPLEMENT);
  }

  //
  // main
  //
  // call repository directly to get account config, getAccountService sanitize config by default
  const { doc: account } = await getAccountService({
    filter: {
      accountId: filter.accountId,
    },
    options: {},
    repositories,
    context: {
      ...context,
      internal: true,
    },
  });
  if (!account) {
    throw new BaseError(AccountError.ACCOUNT_NOT_FOUND);
  }
  checkAccess(account, context);

  const { config } = account as AccountFull;
  const { doc: tradeAccount } = await repositories.trade.getAccount({
    ...filter,
    config,
  });
  if (!tradeAccount) {
    throw new BaseError(AccountError.ACCOUNT_NOT_FOUND);
  }

  // TODO: const assetInfo = await getAssetInfo();
  // tradeAccount.asset = ...

  // non-blocking
  repositories.account.updateAccount(filter, {
    ...tradeAccount,
    providerId: tradeAccount.providerPlatformAccountId,
  });

  const accountPublic: Partial<AccountFull> = {
    ...account,
    ...tradeAccount,
  };
  delete accountPublic.config; // NEVER leak config to user

  return { doc: accountPublic };
};
