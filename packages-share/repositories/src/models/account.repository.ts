import {
  Account, AccountConfig, AccountFull, AccountMember, AccountPlatform,
  AccountSourceType, AccountTradeType, AccountType, AccountViewType,
} from '@fishprovider/core';

import {
  BaseGetManyResult, BaseGetOptions, BaseGetResult, BaseUpdateOptions, BaseUpdateResult,
} from '..';

export interface AccountRepository {
  getAccount?: (
    filter: {
      accountId: string,
      getTradeInfo?: boolean,
      config?: AccountConfig,
      tradeAccountId?: string,
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
    options?: BaseGetOptions<AccountFull>,
  ) => Promise<BaseGetManyResult<AccountFull>>;

  updateAccount?: (
    filter: {
      accountId: string,
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

  // allocateAccountConfig?: (
  //   filter: {
  //     accountPlatform: AccountPlatform,
  //     accountType?: AccountType,
  //     clientId?: string,
  //     accountTradeType?: AccountTradeType,
  //   },
  //   options?: BaseGetOptions<Account>,
  // ) => Promise<BaseGetResult<AccountPrivate['config']>>;

  addAccount?: (
    filter: {
      config: AccountConfig,
      accountId: string,
      name: string,
      accountType: AccountType,
      accountPlatform: AccountPlatform,
      accountViewType: AccountViewType,
      accountTradeType: AccountTradeType,
      sourceType: AccountSourceType,
      members: AccountMember[],
      userId: string,
      userEmail: string,
      userName?: string,
      userPicture?: string,
      updatedAt: Date,
      createdAt: Date,
    },
    options?: BaseGetOptions<Account>,
  ) => Promise<BaseGetResult<Account>>;

  removeAccount?: (
    filter: {
      accountId: string,
    },
  ) => Promise<string>;

  // TODO: add/remove/fetch member
  // TODO: lock account/member
}
