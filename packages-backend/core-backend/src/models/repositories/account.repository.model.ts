import {
  Account, AccountActivity, AccountBannerStatus, AccountConfig, AccountMember, AccountPlatform,
  AccountProtectSettings, AccountSettings, AccountTradeSettings, AccountTradeType, AccountViewType,
  ProviderType,
} from '@fishprovider/core';

import {
  RepositoryCheckResult, RepositoryGetManyResult, RepositoryGetOptions,
  RepositoryGetResult, RepositoryUpdateOptions, RepositoryUpdateResult,
} from '..';

export interface AccountRepository {
  getAccount?: (
    filter: {
      accountId?: string,
      platform?: AccountPlatform,
    },
    options?: RepositoryGetOptions<Account>,
  ) => Promise<RepositoryGetResult<Account>>;

  getAccountProvider?: (
    filter: {
      accountId?: string,
      platform?: AccountPlatform,
      config?: AccountConfig,
    },
    options?: RepositoryGetOptions<Account>,
  ) => Promise<RepositoryGetResult<Account>>;

  checkAccount?: (
    filter: {
      accountId: string,
      name: string,
      providerAccountId?: string,
    },
  ) => Promise<RepositoryCheckResult<Account>>;

  getAccounts?: (
    filter: {
      viewType?: AccountViewType,
      email?: string,
      accountIds?: string[],
      platform?: AccountPlatform,
      tradeRequest?: {
        redirectUrl: string,
        code: string,
      },
    },
    options?: RepositoryGetOptions<Account>,
  ) => Promise<RepositoryGetManyResult<Account>>;

  getAccountProviders?: (
    filter: {
      platform?: AccountPlatform,
      config?: AccountConfig,
      providerCode?: string,
      providerRedirectUrl?: string,
    },
    options?: RepositoryGetOptions<Account>,
  ) => Promise<RepositoryGetManyResult<Account>>;

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
    options?: RepositoryUpdateOptions<Account>,
  ) => Promise<RepositoryUpdateResult<Account>>;

  updateAccounts?: (
    filter: {
      viewType?: AccountViewType,
      email?: string,
    },
    payload: {
      accounts?: Partial<Account>[],
    },
    options?: RepositoryUpdateOptions<Account>,
  ) => Promise<RepositoryGetManyResult<Account>>;

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
    options?: RepositoryUpdateOptions<Account>,
  ) => Promise<RepositoryGetResult<Account>>;

  addAccountProvider?: (
    payload: {
      accountId: string,
      platform: AccountPlatform,
      config?: AccountConfig,
    },
    options?: RepositoryUpdateOptions<Account>,
  ) => Promise<RepositoryGetResult<Account>>;

  removeAccount?: (
    filter: {
      accountId?: string,
    },
    options?: RepositoryUpdateOptions<Account>,
  ) => Promise<RepositoryGetResult<Account>>;

  getTradeClient?: (
    filter: {
      platform: AccountPlatform,
      clientId?: string,
    },
  ) => Promise<RepositoryGetResult<AccountConfig>>;

  updateTradeClient?: (
    filter: {
      platform: AccountPlatform,
      clientId: string,
      addActiveAccounts: number,
    },
  ) => Promise<any>;
}
