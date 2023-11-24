import {
  Account, AccountError, AccountViewType, BaseError, getRoleProvider,
} from '@fishprovider/core';

import {
  ServiceContext,
} from '..';

export const sanitizeOutputAccount = (account?: Partial<Account>) => ({
  ...account,
  config: undefined,
});

//
// check functions
//

export const checkAccountAccess = (
  account?: Partial<Account>,
  context?: ServiceContext,
) => {
  if (!account) {
    throw new BaseError(AccountError.ACCOUNT_NOT_FOUND);
  }

  const { isManagerWeb } = getRoleProvider(context?.userSession?.roles);
  const { viewType, members, deleted } = account;

  const check = () => {
    if (isManagerWeb) return true;
    if (deleted) {
      throw new BaseError(AccountError.ACCOUNT_ACCESS_DENIED, account._id, 'deleted');
    }
    if (viewType === AccountViewType.public) return true;

    // for private accounts
    if (!context?.userSession?._id) {
      throw new BaseError(AccountError.ACCOUNT_ACCESS_DENIED, account._id, 'private');
    }
    const { userSession } = context;
    if (members?.some((item) => item.email === userSession.email)) return true;

    throw new BaseError(AccountError.ACCOUNT_ACCESS_DENIED, account._id);
  };
  check();

  return account;
};
