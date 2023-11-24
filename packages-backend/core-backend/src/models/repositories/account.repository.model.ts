import {
  Account, AccountActivity, AccountBannerStatus, AccountConfig, AccountMember, AccountPlatform,
  AccountProtectSettings, AccountSettings, AccountTradeSettings, AccountTradeType, AccountViewType,
  ProviderType,
} from '@fishprovider/core';

import {
  BaseGetManyResult, BaseGetOptions, BaseGetResult, BaseUpdateOptions, BaseUpdateResult,
} from '..';

export interface AccountRepository {
  getAccount?: (
    filter: {
      accountId?: string,
      checkExist?: {
        accountId: string,
        name: string,
        tradeAccountId?: string,
      },
      accountPlatform?: AccountPlatform,
      config?: AccountConfig,
    },
    options?: BaseGetOptions<Account>,
  ) => Promise<BaseGetResult<Account>>;

  getAccounts?: (
    filter: {
      accountViewType?: AccountViewType,
      email?: string,
      accountIds?: string[],
      accountPlatform?: AccountPlatform,
      config?: AccountConfig,
      tradeRequest?: {
        redirectUrl?: string,
        code?: string,
      },
    },
    options?: BaseGetOptions<Account>,
  ) => Promise<BaseGetManyResult<Account>>;

  updateAccount?: (
    filter: {
      accountId?: string,
    },
    payload: {
      accountViewType?: AccountViewType,
      name?: string,
      icon?: string,
      strategyId?: string,
      assetId?: string,
      asset?: string,
      leverage?: number,
      balance?: number,
      equity?: number,
      margin?: number,
      freeMargin?: number,
      marginLevel?: number,
      notes?: string,
      privateNotes?: string,
      bannerStatus?: AccountBannerStatus,
      tradeSettings?: AccountTradeSettings;
      protectSettings?: AccountProtectSettings;
      settings?: AccountSettings;
      providerData?: any,
      addActivity?: AccountActivity,
      addMember?: AccountMember,
      removeMemberEmail?: string,
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

  addAccount?: (
    payload: {
      accountId: string,
      name: string,
      config?: AccountConfig,
      providerType: ProviderType,
      accountPlatform: AccountPlatform,
      accountViewType: AccountViewType,
      accountTradeType: AccountTradeType,
      members: AccountMember[],
    },
  ) => Promise<BaseGetResult<Account>>;

  removeAccount?: (
    filter: {
      accountId?: string,
    },
  ) => Promise<BaseGetResult<Account>>;

  getTradeClient?: (
    filter: {
      accountPlatform: AccountPlatform,
      clientId?: string,
    },
  ) => Promise<BaseGetResult<AccountConfig>>;

  updateTradeClient?: (
    filter: {
      accountPlatform: AccountPlatform,
      clientId: string,
      addActiveAccounts: number,
    },
  ) => Promise<any>;
}
