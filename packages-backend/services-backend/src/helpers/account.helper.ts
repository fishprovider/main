import {
  AccountError, AccountFull, AccountViewType, BaseError, ServiceContext,
} from '@fishprovider/core';

import { getRoleProvider } from '..';

export const sanitizeOutputAccount = (account?: Partial<AccountFull>) => ({
  ...account,
  config: undefined,
});

//
// check functions
//

export const checkAccountAccess = (
  account?: Partial<AccountFull>,
  context?: ServiceContext,
) => {
  if (!account) {
    throw new BaseError(AccountError.ACCOUNT_NOT_FOUND);
  }

  const { isManagerWeb } = getRoleProvider(context?.userSession?.roles);
  const { accountViewType, members, deleted } = account;

  const hasAccess = () => {
    if (isManagerWeb) return true;
    if (deleted) return false;
    if (accountViewType === AccountViewType.public) return true;

    // for private accounts
    if (!context?.userSession?._id) return false;
    const { userSession } = context;
    if (members?.some((item) => item.email === userSession.email)) return true;

    return false;
  };

  if (!hasAccess()) {
    throw new BaseError(AccountError.ACCOUNT_ACCESS_DENIED, account._id);
  }

  return account;
};
