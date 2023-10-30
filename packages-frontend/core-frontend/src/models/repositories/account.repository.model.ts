import {
  Account, AccountConfig, AccountFull, AccountMember, AccountViewType,
} from '@fishprovider/core';

import {
  BaseGetManyResult, BaseGetOptions, BaseGetResult, BaseUpdateOptions, BaseUpdateResult,
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

  updateAccount?: (
    filter: {
      accountId?: string,
    },
    payload: {
      name?: string,
      assetId?: string,
      leverage?: number,
      balance?: number,
      providerData?: any,
      member?: AccountMember,
      doc?: Partial<Account>,
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
}
