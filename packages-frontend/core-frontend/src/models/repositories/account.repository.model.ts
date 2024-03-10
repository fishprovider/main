import {
  Account, AccountActivity, AccountBannerStatus, AccountConfig, AccountPlatform,
  AccountProtectSettings, AccountSettings, AccountTradeSettings, AccountTradeType,
  AccountViewType, ProviderType,
} from '@fishprovider/core';

import {
  RepositoryGetManyResult, RepositoryGetOptions, RepositoryGetResult, RepositoryUpdateOptions,
  RepositoryUpdateResult,
} from '..';

export interface AccountRepository {
  getAccount?: (
    filter: {
      accountId?: string,
      getTradeAccount?: boolean,
    },
    options?: RepositoryGetOptions<Account>,
  ) => Promise<RepositoryGetResult<Account>>;

  getAccounts?: (
    filter: {
      viewType?: AccountViewType,
      getTradeAccounts?: {
        platform: AccountPlatform,
        baseConfig: Partial<AccountConfig>,
        tradeRequest?: {
          redirectUrl: string,
          code: string,
        },
      },
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
      notes?: string,
      privateNotes?: string,
      bannerStatus?: AccountBannerStatus,
      tradeSettings?: AccountTradeSettings;
      protectSettings?: AccountProtectSettings;
      settings?: AccountSettings;
      addActivity?: AccountActivity,
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
      name: string,
      providerType: ProviderType,
      platform: AccountPlatform,
      tradeType: AccountTradeType,
      baseConfig: Partial<AccountConfig>,
    },
    options?: RepositoryUpdateOptions<Account>,
  ) => Promise<RepositoryGetResult<Account>>;

  removeAccount?: (
    filter: {
      accountId: string,
    },
    options?: RepositoryUpdateOptions<Account>,
  ) => Promise<RepositoryGetResult<Account>>;

  watchAccount?: <T>(
    selector: (state: Record<string, Account>) => T,
  ) => T;
}
