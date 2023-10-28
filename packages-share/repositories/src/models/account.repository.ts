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

  addAccount?: (
    payload: {
      accountId: string,
      config: AccountConfig,
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
  ) => Promise<BaseGetResult<Account>>;

  removeAccount?: (
    filter: {
      accountId: string,
    },
  ) => Promise<string>;

  getTradeClient?: (
    filter: {
      accountType: AccountType,
      accountPlatform: AccountPlatform,
      clientId?: string,
    },
  ) => Promise<BaseGetResult<AccountConfig>>;

  addTradeAccount?: (
    payload: {
      accountPlatform: AccountPlatform,
      config: AccountConfig,
    },
  ) => Promise<BaseGetResult<AccountConfig>>;

  // TODO: add/remove/fetch member
  // TODO: lock account/member
}
