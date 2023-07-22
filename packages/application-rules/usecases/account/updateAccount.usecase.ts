import type { Account } from '@fishprovider/enterprise-rules';
import _ from 'lodash';

import type { AccountRepository, UpdateAccountRepositoryParams } from './_account.repository';

const updateAccountAllowUpdateFields: Array<keyof Account> = [
  'name',
];

export type UpdateAccountUseCaseParams = UpdateAccountRepositoryParams;

export type UpdateAccountUseCase = (
  params: UpdateAccountUseCaseParams
) => Promise<boolean>;

export const internalUpdateAccountUseCase = (
  AccountRepository: AccountRepository,
): UpdateAccountUseCase => async (
  params: UpdateAccountUseCaseParams,
) => {
  const res = await AccountRepository.updateAccount(params);
  return res;
};

export const updateAccountUseCase = (
  AccountRepository: AccountRepository,
): UpdateAccountUseCase => async (
  params: UpdateAccountUseCaseParams,
) => {
  const { accountId, payload } = params;

  const repositoryParams = {
    accountId,
    payload: _.pick(payload, updateAccountAllowUpdateFields),
  };
  return internalUpdateAccountUseCase(AccountRepository)(repositoryParams);
};
