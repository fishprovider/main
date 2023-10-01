import {
  Account, AccountError, AccountFull, AccountViewType, BaseError,
} from '@fishprovider/core';
import { BaseGetOptions } from '@fishprovider/repositories';

import {
  getRoleProvider, sanitizeBaseGetOptions, ServiceContext,
} from '..';

export const sanitizeAccountBaseGetOptions = (
  options?: BaseGetOptions<AccountFull>,
) => options && sanitizeBaseGetOptions(
  options,
  {
    config: 0,
  },
);

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

  if (context?.internal) return account;

  const { isManagerWeb } = getRoleProvider(context?.userSession?.roles);
  const {
    providerViewType, userId, members, memberInvites, deleted,
  } = account;

  const hasAccess = () => {
    if (isManagerWeb) return true;
    if (deleted) return false;
    if (providerViewType === AccountViewType.public) return true;

    // for private accounts
    if (!context?.userSession?._id) return false;
    const { userSession } = context;
    if (userId === userSession._id) return true;
    if (members?.some((item) => item.userId === userSession._id)) return true;
    if (memberInvites?.some((item) => item.email === userSession.email)) return true;

    return false;
  };

  if (!hasAccess()) {
    throw new BaseError(AccountError.ACCOUNT_ACCESS_DENIED);
  }

  return account;
};
