import {
  Account, AccountConfig, AccountMember, AccountPlatform, AccountPrivate,
  AccountSourceType, AccountTradeType, AccountType, AccountViewType,
} from '@fishprovider/core';

import {
  BaseGetManyResult, BaseGetOptions, BaseGetResult, BaseUpdateOptions, BaseUpdateResult,
} from '..';

export interface AccountRepository {
  getAccount?: (
    filter: {
      accountId: string,
      // trade
      config?: AccountConfig,
    },
    options?: BaseGetOptions<Account>,
  ) => Promise<BaseGetResult<Account>>;

  getAccounts?: (
    filter: {
      accountViewType?: AccountViewType,
      email?: string,
      accountIds?: string[],
      // trade
      config?: AccountConfig,
    },
    options?: BaseGetOptions<Account>,
  ) => Promise<BaseGetManyResult<Account>>;

  updateAccount?: (
    filter: {
      accountId: string,
    },
    payload: {
      name?: string,
      // trade
      assetId?: string,
      leverage?: number,
      balance?: number,
      providerData?: any,
      // members
      member?: AccountMember,
    },
    options?: BaseUpdateOptions<Account>,
  ) => Promise<BaseUpdateResult<Account>>;

  // TODO:

  allocateAccountConfig?: (
    filter: {
      accountPlatform: AccountPlatform,
      accountType?: AccountType,
      clientId?: string,
      accountTradeType?: AccountTradeType,
    },
    options?: BaseGetOptions<Account>,
  ) => Promise<BaseGetResult<AccountPrivate['config']>>;

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
