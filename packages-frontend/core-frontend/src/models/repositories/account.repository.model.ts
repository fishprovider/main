import {
  Account, AccountConfig, AccountFull, AccountViewType,
} from '@fishprovider/core';

import {
  BaseGetManyResult, BaseGetOptions, BaseGetResult,
} from '..';

export interface AccountRepository {
  getAccount?: (
    filter: {
      accountId?: string,
      getTradeInfo?: boolean,
      config?: AccountConfig,
      tradeAccountId?: string,
      orFilter?: {
        accountId?: string,
        name?: string,
        tradeAccountId?: string,
      },
    },
    options?: BaseGetOptions<AccountFull>,
  ) => Promise<BaseGetResult<AccountFull>>;

  getAccounts?: (
    filter: {
      accountViewType?: AccountViewType,
      email?: string,
      accountIds?: string[],
      config?: AccountConfig,
    },
    options?: BaseGetOptions<Account>,
  ) => Promise<BaseGetManyResult<Account>>;
}
