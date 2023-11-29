import {
  Account, AccountActivity, AccountBannerStatus, AccountConfig, AccountPlatform,
  AccountProtectSettings, AccountSettings, AccountTradeSettings, AccountTradeType,
  AccountViewType, ProviderType,
} from '@fishprovider/core';

import {
  BaseGetManyResult, BaseGetOptions, BaseGetResult, BaseUpdateOptions, BaseUpdateResult,
} from '..';

export interface AccountRepository {
  getAccount?: (
    filter: {
      accountId?: string,
      getTradeAccount?: boolean,
    },
    options?: BaseGetOptions<Account>,
  ) => Promise<BaseGetResult<Account>>;

  getAccounts?: (
    filter: {
      viewType?: AccountViewType,
      email?: string,
      getTradeAccounts?: {
        platform: AccountPlatform,
        baseConfig: Partial<AccountConfig>,
        tradeRequest?: {
          redirectUrl: string,
          code: string,
        },
      },
    },
    options?: BaseGetOptions<Account>,
  ) => Promise<BaseGetManyResult<Account>>;

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
    options?: BaseGetOptions<Account>,
  ) => Promise<BaseGetManyResult<Account>>;

  addAccount?: (
    payload: {
      name: string,
      providerType: ProviderType,
      platform: AccountPlatform,
      tradeType: AccountTradeType,
      baseConfig: Partial<AccountConfig>,
    },
  ) => Promise<BaseGetResult<Account>>;

  removeAccount?: (
    filter: {
      accountId: string,
    },
  ) => Promise<BaseGetResult<Account>>;

  watchAccount?: <T>(
    selector: (state: Record<string, Account>) => T,
  ) => T;
}
