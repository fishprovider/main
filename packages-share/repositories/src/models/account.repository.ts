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
      config?: AccountConfig,
    },
    options?: BaseGetOptions<Account>,
  ) => Promise<BaseGetResult<Account>>;

  updateAccount?: (
    filter: {
      accountId: string,
    },
    payload: {
      name?: string,
      addMember?: AccountMember,
      removeMemberId?: string,
      removeMemberInviteEmail?: string,
      // from TradeAccount
      balance?: number,
      assetId?: string,
      leverage?: number,
      providerId?: string,
      providerData?: any,
      updatedAt?: Date,
    },
    options?: BaseUpdateOptions<Account>,
  ) => Promise<BaseUpdateResult<Account>>;

  getAccounts?: (
    filter: {
      accountIds?: string[],
      accountViewType?: AccountViewType,
      memberId?: string,
      email?: string,
      redirectCode?: string,
      redirectUrl?: string,
      config?: AccountConfig,
    },
    options?: BaseGetOptions<Account>,
  ) => Promise<BaseGetManyResult<Account>>;

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
