import { getRoleProvider, validateProjection } from '@fishprovider/core-utils';
import {
  type Account,
  AccountError,
  AccountViewType,
  type GetAccountParams,
  type Projection,
  RepositoryError,
  ServiceError,
  type User,
} from '@fishprovider/models';

import { AccountService } from '.';

export const getAccount = (
  userService: AccountService,
) => async (params: GetAccountParams & { user?: Partial<User> }) => {
  const { user, projection: projectionRaw, ...rest } = params;
  const { accountId } = rest;
  if (!accountId) {
    throw new Error(ServiceError.BAD_REQUEST);
  }

  const { accountRepository } = userService;

  const projection: Projection<Account> = {
    ...projectionRaw,
    config: 0,
  };

  const account = await accountRepository.getAccount({
    ...rest,
    projection,
  });

  if (!account) {
    throw new Error(AccountError.ACCOUNT_NOT_FOUND);
  }

  if (!validateProjection(projection, account)) {
    throw new Error(RepositoryError.BAD_RESULT);
  }

  const { isManagerWeb } = getRoleProvider(user?.roles);

  const {
    providerViewType, userId, members, memberInvites, deleted,
  } = account;

  const checkAccess = () => {
    if (isManagerWeb) return true;
    if (deleted) return false;
    if (providerViewType === AccountViewType.public) return true;

    // for private accounts
    if (!user?._id) return false;
    if (userId === user._id) return true;
    if (members?.some((item) => item.userId === user._id)) return true;
    if (memberInvites?.some((item) => item.email === user.email)) return true;

    return false;
  };
  if (!checkAccess()) {
    throw new Error(AccountError.ACCOUNT_ACCESS_DENIED);
  }

  return account;
};
