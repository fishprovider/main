import { type Account, AccountError } from '@fishprovider/enterprise-rules';

import type { AccountRepository, GetAccountExternalRepositoryParams } from './_account.repository';

export type GetAccountExternalUseCaseParams = GetAccountExternalRepositoryParams;

export type GetAccountExternalUseCase = (
  params: GetAccountExternalUseCaseParams
) => Promise<Partial<Account>>;

export const getAccountExternalUseCase = (
  accountRepository: AccountRepository,
): GetAccountExternalUseCase => async (
  params: GetAccountExternalUseCaseParams,
) => {
  const account = await accountRepository.getAccountExternal(params);
  if (!account) {
    throw new Error(AccountError.ACCOUNT_NOT_FOUND);
  }
  return account;
};
