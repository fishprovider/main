import {
  AccountError, BaseError, checkRepository,
} from '@fishprovider/core';

import {
  checkAccountAccess, checkLogin, GetTradeAccountService,
} from '../..';

export const getTradeAccountService: GetTradeAccountService = async ({
  filter, repositories, context,
}) => {
  //
  // pre-check
  //
  checkLogin(context?.userSession);
  const getAccountRepo = checkRepository(repositories.account.getAccount);
  const getAccountProviderRepo = checkRepository(repositories.trade.getAccountProvider);
  const updateAccountRepo = checkRepository(repositories.account.updateAccount);

  //
  // main
  //
  const { accountId } = filter;
  const { doc: account } = await getAccountRepo(filter, {
    projection: {
      _id: 1,
      members: 1,
      platform: 1,
      config: 1,
    },
  });
  const { platform, config } = checkAccountAccess(account, context);

  const { doc: tradeAccount } = await getAccountProviderRepo({
    ...filter,
    platform,
    config,
  });
  if (!tradeAccount) {
    throw new BaseError(AccountError.ACCOUNT_NOT_FOUND);
  }

  // non-blocking
  updateAccountRepo(filter, tradeAccount);

  return {
    doc: {
      ...tradeAccount,
      _id: accountId,
    },
  };
};
