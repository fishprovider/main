import {
  AccountError, BaseError,
} from '@fishprovider/core';

import {
  checkAccountAccess, checkLogin, checkRepository, GetTradeAccountService, sanitizeOutputAccount,
} from '../..';

export const getTradeAccountService: GetTradeAccountService = async ({
  filter, repositories, context,
}) => {
  //
  // pre-check
  //
  checkLogin(context?.userSession);
  const getAccountRepo = checkRepository(repositories.account.getAccount);
  const getTradeAccountRepo = checkRepository(repositories.trade?.getAccount);
  const updateAccountRepo = checkRepository(repositories.account.updateAccount);

  //
  // main
  //
  const { accountId } = filter;
  const { doc: account } = await getAccountRepo(filter, {
    projection: {
      _id: 1,
      members: 1,
      config: 1,
    },
  });
  const { config } = checkAccountAccess(account, context);

  const { doc: tradeAccount } = await getTradeAccountRepo({
    ...filter,
    config,
  });
  if (!tradeAccount) {
    throw new BaseError(AccountError.ACCOUNT_NOT_FOUND);
  }

  // non-blocking
  updateAccountRepo(filter, tradeAccount);

  return {
    doc: {
      ...sanitizeOutputAccount(tradeAccount),
      _id: accountId,
    },
  };
};
