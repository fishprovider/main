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
) => Promise<boolean>;

export const updateAccountUseCase = (
  AccountRepository: AccountRepository,
): UpdateAccountUseCase => async (
  params: UpdateAccountUseCaseParams,
) => {
  const {
    isInternal, accountId, payload,
  } = params;

  const repositoryParams = isInternal ? params : {
    accountId,
    payload: _.pick(payload, updateAccountAllowUpdateFields),
  };

  const res = await AccountRepository.updateAccount(repositoryParams);
  return res;
};
