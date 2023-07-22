import type { Account } from '@fishprovider/enterprise-rules';

import type { AccountRepository, GetAccountExternalRepositoryParams } from './_account.repository';

export type GetAccountExternalUseCaseParams = GetAccountExternalRepositoryParams;

export type GetAccountExternalUseCase = (
  params: GetAccountExternalUseCaseParams
) => Promise<Partial<Account> | null>;

export const getAccountExternalUseCase = (
  accountRepository: AccountRepository,
): GetAccountExternalUseCase => async (
  params: GetAccountExternalUseCaseParams,
) => {
  const account = await accountRepository.getAccountExternal(params);
  return account;
};
