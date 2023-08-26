import type { AccountRepository } from '@fishprovider/models';

import { getAccount } from './getAccount';

export interface AccountServiceParams {
  accountRepository: AccountRepository,
}

export class AccountService {
  accountRepository: AccountRepository;

  constructor(params: AccountServiceParams) {
    this.accountRepository = params.accountRepository;
  }

  getAccount = getAccount(this);
}
