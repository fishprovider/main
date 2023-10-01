import { AccountError, BaseError } from '@fishprovider/core';

import {
  checkLogin, checkRepository, getAccountService, GetTradeAccountService, updateAccountService,
} from '../..';

export const getTradeAccountService: GetTradeAccountService = async ({
  filter, repositories, context,
}) => {
  //
  // pre-check
  //
  checkLogin(context?.userSession);
  const getAccountRepo = checkRepository(repositories.trade.getAccount);

  //
  // main
  //
  // call repository directly to get account config, getAccountService sanitize config by default
  const { doc: privateAccount } = await getAccountService({
    filter: {
      accountId: filter.accountId,
    },
    options: {
      projection: {
        _id: 1,
        config: 1,
      },
    },
    repositories,
    context: {
      ...context,
      internal: true,
    },
  });
  if (!privateAccount) {
    throw new BaseError(AccountError.ACCOUNT_NOT_FOUND);
  }

  const { config } = privateAccount;
  const { doc: tradeAccount } = await getAccountRepo({
    ...filter,
    config,
  });
  if (!tradeAccount) {
    throw new BaseError(AccountError.ACCOUNT_NOT_FOUND);
  }

  // TODO: const assetInfo = await getAssetInfo();
  // tradeAccount.asset = ...

  // non-blocking
  updateAccountService({
    filter,
    payload: tradeAccount,
    repositories,
    context: {
      ...context,
      internal: true,
    },
  });

  return { doc: tradeAccount };
};
