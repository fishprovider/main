import {
  AccountError, BaseError, checkRepository, getRoleProvider,
} from '@fishprovider/core';

import {
  checkAccountAccess, checkLogin, checkProjection, sanitizeOutputAccount,
  UpdateAccountService,
} from '../..';

export const updateAccountService: UpdateAccountService = async ({
  filter, payload, options, repositories, context,
}) => {
  //
  // pre-check
  //
  const userSession = checkLogin(context?.userSession);
  const getAccountRepo = checkRepository(repositories.account.getAccount);
  const updateAccountRepo = checkRepository(repositories.account.updateAccount);

  //
  // main
  //
  const { roles } = userSession;
  const { accountId } = filter;
  const { tradeSettings, protectSettings, settings } = payload;

  const {
    isAdminProvider, isTraderProvider, isProtectorProvider, isViewerProvider,
  } = getRoleProvider(roles, accountId);
  if (!isViewerProvider) {
    throw new BaseError(AccountError.ACCOUNT_ACCESS_DENIED, accountId);
  }

  const { doc: account } = await getAccountRepo(filter, {
    projection: {
      _id: 1,
      members: 1,
    },
  });
  checkAccountAccess(account, context);

  if (tradeSettings && !isTraderProvider) {
    throw new BaseError(AccountError.ACCOUNT_ACCESS_DENIED, accountId);
  }
  if (protectSettings && !isProtectorProvider) {
    throw new BaseError(AccountError.ACCOUNT_ACCESS_DENIED, accountId);
  }
  if (settings && !isAdminProvider) {
    throw new BaseError(AccountError.ACCOUNT_ACCESS_DENIED, accountId);
  }

  // TODO: implement more if checks

  const { doc: accountNew } = await updateAccountRepo(filter, payload, options);

  checkProjection(options?.projection, accountNew);

  return {
    doc: {
      ...sanitizeOutputAccount(accountNew),
      _id: accountId,
    },
  };
};
