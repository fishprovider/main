import { AccountError, AccountFull, BaseError } from '@fishprovider/core';
import { RepositoryError } from '@fishprovider/repositories';

import {
  checkAccess, GetTradeAccountService, validateProjection,
} from '../..';

export const getTradeAccountService: GetTradeAccountService = async ({
  filter, options, repositories, context,
}) => {
  //
  // pre-check
  //
  if (!repositories.account.getAccount) throw new BaseError(RepositoryError.REPOSITORY_NOT_IMPLEMENT);
  if (!repositories.trade.getAccount) throw new BaseError(RepositoryError.REPOSITORY_NOT_IMPLEMENT);

  //
  // main
  //
  const { doc: account } = await repositories.account.getAccount(filter, options);
  if (!account) {
    throw new BaseError(AccountError.ACCOUNT_NOT_FOUND);
  }
  if (!validateProjection(options?.projection, account)) {
    throw new BaseError(RepositoryError.REPOSITORY_INVALID_PROJECTION);
  }
  checkAccess(account, context);

  const { config } = account as AccountFull;
  const { doc: tradeAccount } = await repositories.trade.getAccount({
    ...filter,
    config,
  }, options);
  if (!tradeAccount) {
    throw new BaseError(AccountError.ACCOUNT_NOT_FOUND);
  }

  const accountPublic: Partial<AccountFull> = {
    ...account,
    ...tradeAccount,
  };
  delete accountPublic.config; // NEVER leak config to user

  // TODO: const assetInfo = await getAssetInfo();
  // TODO: updateCache(accountInfo); // non-blocking

  return { doc: accountPublic };
};
