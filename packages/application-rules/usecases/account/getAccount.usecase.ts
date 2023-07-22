import {
  type Account, AccountError, AccountViewType, type User,
} from '@fishprovider/enterprise-rules';

import { getRoleProvider } from '~helpers';

import type { AccountRepository, GetAccountRepositoryParams } from './_account.repository';

export interface GetAccountUseCaseParams extends GetAccountRepositoryParams {
  user?: Partial<User>;
}

export type GetAccountUseCase = (
  params: GetAccountUseCaseParams
) => Promise<Partial<Account>>;

export const internalGetAccountUseCase = (
  accountRepository: AccountRepository,
): GetAccountUseCase => async (
  params: GetAccountUseCaseParams,
) => {
  const account = await accountRepository.getAccount(params);
  if (!account) {
    throw new Error(AccountError.ACCOUNT_NOT_FOUND);
  }
  return account;
};

export const getAccountUseCase = (
  accountRepository: AccountRepository,
): GetAccountUseCase => async (
  params: GetAccountUseCaseParams,
) => {
  const { user } = params;

  const account = await accountRepository.getAccount(params);
  if (!account) {
    throw new Error(AccountError.ACCOUNT_NOT_FOUND);
  }

  const {
    providerViewType,
    userId, members, memberInvites,
    deleted,
  } = account;

  const { isManagerWeb } = getRoleProvider(user?.roles);

  const checkAccess = () => {
    if (isManagerWeb) return true;
    if (deleted) return false;
    if (providerViewType === AccountViewType.public) return true;
    if (user?._id) {
      if (userId === user._id) return true;
      if (members?.some((item) => item.userId === user._id)) return true;
      if (memberInvites?.some((item) => item.email === user.email)) return true;
    }
    return false;
  };
  if (!checkAccess()) {
    throw new Error(AccountError.ACCOUNT_ACCESS_DENIED);
  }
  return account;
};
