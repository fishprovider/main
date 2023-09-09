import {
  Account, AccountError, AccountViewType, BaseError, BaseGetOptions, ServiceContext,
} from '@fishprovider-new/core';

import { getRoleProvider, sanitizeBaseGetOptions } from '..';

export const sanitizeAccountBaseGetOptions = (
  options: BaseGetOptions<Account>,
) => sanitizeBaseGetOptions(
  options,
  {
    config: 0,
  },
);

export const checkAccess = (
  account: Partial<Account>,
  context?: ServiceContext,
) => {
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
};
