import type { Account } from '@fishprovider/core-new';
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

  async run(
    params: UpdateAccountUseCaseParams,
  ): Promise<boolean> {
    const { accountId, payload } = params;

    const repositoryParams = {
      accountId,
      payload: _.pick(payload, updateAccountAllowUpdateFields),
    };
    const res = await this.accountRepository.updateAccount(repositoryParams);
    return res;
  }
}
