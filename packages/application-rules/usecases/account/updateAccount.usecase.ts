import type { Account } from '@fishprovider/enterprise-rules';
import _ from 'lodash';

import type { AccountRepository, UpdateAccountRepositoryParams } from '~repositories';

const updateAccountAllowUpdateFields: Array<keyof Account> = [
  'name',
];

export type UpdateAccountUseCaseParams = UpdateAccountRepositoryParams;

export class UpdateAccountUseCase {
  accountRepository: AccountRepository;

  constructor(
    accountRepository: AccountRepository,
  ) {
    this.accountRepository = accountRepository;
  }

  async runInternal(
    params: UpdateAccountUseCaseParams,
  ): Promise<boolean> {
    const res = await this.accountRepository.updateAccount(params);
    return res;
  }

  async run(
    params: UpdateAccountUseCaseParams,
  ): Promise<boolean> {
    const { accountId, payload } = params;

    const repositoryParams = {
      accountId,
      payload: _.pick(payload, updateAccountAllowUpdateFields),
    };
    return this.runInternal(repositoryParams);
  }
}
