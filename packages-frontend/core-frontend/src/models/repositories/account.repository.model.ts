import {
  Account, AccountViewType,
} from '@fishprovider/core';

import {
  BaseGetManyResult, BaseGetOptions, BaseGetResult, BaseUpdateOptions, BaseUpdateResult,
} from '..';

export interface AccountRepository {
  getAccount?: (
    filter: {
      accountId?: string,
      getTradeInfo?: boolean,
    },
    options?: BaseGetOptions<Account>,
  ) => Promise<BaseGetResult<Account>>;

  getAccounts?: (
    filter: {
      accountViewType?: AccountViewType,
      email?: string,
    },
    options?: BaseGetOptions<Account>,
  ) => Promise<BaseGetManyResult<Account>>;

  updateAccount?: (
    filter: {
      accountId?: string,
    },
    payload: {
      account?: Partial<Account>,
    },
    options?: BaseUpdateOptions<Account>,
  ) => Promise<BaseUpdateResult<Account>>;

  updateAccounts?: (
    filter: {
      accountViewType?: AccountViewType,
      email?: string,
    },
    payload: {
      accounts?: Partial<Account>[],
    },
    options?: BaseGetOptions<Account>,
  ) => Promise<BaseGetManyResult<Account>>;

  removeAccount?: (
    filter: {
      accountId: string,
    },
  ) => Promise<any>;
}
