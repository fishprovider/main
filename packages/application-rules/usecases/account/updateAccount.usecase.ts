import type { Account } from '@fishprovider/enterprise-rules';
import _ from 'lodash';

import type { AccountRepository, UpdateAccountRepositoryParams } from './_account.repository';

const updateAccountAllowUpdateFields: Array<keyof Account> = [
  'name',
];

export interface UpdateAccountUseCaseParams extends UpdateAccountRepositoryParams {
  isInternal?: boolean;
}

export type UpdateAccountUseCase = (
  params: UpdateAccountUseCaseParams
) => Promise<Partial<Account> | boolean>;

export const updateAccountUseCase = (
  AccountRepository: AccountRepository,
): UpdateAccountUseCase => async (
  params: UpdateAccountUseCaseParams,
) => {
  const {
    isInternal, accountId, payload, returnDoc,
  } = params;

  const repositoryParams = isInternal ? params : {
    accountId,
    payload: _.pick(payload, updateAccountAllowUpdateFields),
    returnDoc,
  };

  const res = await AccountRepository.updateAccount(repositoryParams);
  return res;
};
