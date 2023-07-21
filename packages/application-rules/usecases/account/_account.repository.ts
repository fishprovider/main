import type { Account } from '@fishprovider/enterprise-rules';

import type { Projection } from '~types/repository';

export interface GetAccountRepositoryParams {
  accountId: string,
  projection?: Projection<Account>,
}

export interface AccountRepository {
  getAccount: (params: GetAccountRepositoryParams) => Promise<Account | undefined>;
}
