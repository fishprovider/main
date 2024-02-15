import {
  Account, AccountActivity, AccountBannerStatus, AccountConfig, AccountMember, AccountPlatform,
  AccountProtectSettings, AccountSettings, AccountTradeSettings, AccountTradeType, AccountViewType,
  ProviderType,
} from '@fishprovider/core';

import {
  BaseGetManyResult, BaseGetOptions, BaseGetResult, BaseUpdateOptions, BaseUpdateResult,
} from '..';

export interface AccountRepository {
  /** @deprecated */
  getAccount?: (
    filter: {
      accountId?: string,
      checkExist?: {
        accountId: string,
        name: string,
        tradeAccountId?: string,
      },
      platform?: AccountPlatform,
      config?: AccountConfig,
    },
    options?: BaseGetOptions<Account>,
  ) => Promise<BaseGetResult<Account>>;

  getAccountBase?: (
    filter: {
      accountId?: string,
      platform?: AccountPlatform,
    },
    options?: BaseGetOptions<Account>,
  ) => Promise<BaseGetResult<Account>>;

  getAccountProvider?: (
    filter: {
      config?: AccountConfig,
    },
    options?: BaseGetOptions<Account>,
  ) => Promise<BaseGetResult<Account>>;

  checkAccount?: (
    filter: {
      accountId: string,
      name: string,
      providerAccountId?: string,
    },
    options?: BaseGetOptions<Account>,
  ) => Promise<BaseGetResult<Account>>;

  /** @deprecated */
  getAccounts?: (
    filter: {
      viewType?: AccountViewType,
      email?: string,
      accountIds?: string[],
      platform?: AccountPlatform,
      config?: AccountConfig,
      tradeRequest?: {
        redirectUrl: string,
        code: string,
      },
    },
    options?: BaseGetOptions<Account>,
  ) => Promise<BaseGetManyResult<Account>>;

  getAccountsBase?: (
    filter: {
      accountIds?: string[],
      viewType?: AccountViewType,
      email?: string,
      platform?: AccountPlatform,
    },
    options?: BaseGetOptions<Account>,
  ) => Promise<BaseGetResult<Account>>;

  getAccountsProvider?: (
    filter: {
      config?: AccountConfig,
      providerCode?: string,
      providerRedirectUrl?: string,
    },
    options?: BaseGetOptions<Account>,
  ) => Promise<BaseGetResult<Account>>;

  updateAccount?: (
    filter: {
      accountId?: string,
    },
    payload: {
      viewType?: AccountViewType,
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
      viewType?: AccountViewType,
      email?: string,
    },
    payload: {
      accounts?: Partial<Account>[],
    },
    options?: BaseUpdateOptions<Account>,
  ) => Promise<BaseGetManyResult<Account>>;

  addAccount?: (
    payload: {
      accountId: string,
      name: string,
      config?: AccountConfig,
      providerType: ProviderType,
      platform: AccountPlatform,
      viewType: AccountViewType,
      tradeType: AccountTradeType,
      members: AccountMember[],
    },
    options?: BaseUpdateOptions<Account>,
  ) => Promise<BaseGetResult<Account>>;

  removeAccount?: (
    filter: {
      accountId?: string,
    },
    options?: BaseUpdateOptions<Account>,
  ) => Promise<BaseGetResult<Account>>;

  getTradeClient?: (
    filter: {
      platform: AccountPlatform,
      clientId?: string,
    },
  ) => Promise<BaseGetResult<AccountConfig>>;

  updateTradeClient?: (
    filter: {
      platform: AccountPlatform,
      clientId: string,
      addActiveAccounts: number,
    },
  ) => Promise<any>;
}
