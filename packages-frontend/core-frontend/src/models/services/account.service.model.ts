import {
  Account, AccountActivity, AccountBannerStatus, AccountConfig, AccountPlatform,
  AccountProtectSettings, AccountSettings, AccountTradeSettings, AccountTradeType,
  AccountViewType, ProviderType,
} from '@fishprovider/core';

import { AccountRepository, BaseGetManyResult, BaseGetResult } from '..';

export type GetAccountService = (params: {
  filter: {
    accountId: string,
    getTradeInfo?: boolean,
  },
  repositories: {
    account: AccountRepository
  },
}) => Promise<BaseGetResult<Account>>;

export type GetAccountsService = (params: {
  filter: {
    viewType?: AccountViewType,
    email?: string,
  },
  repositories: {
    account: AccountRepository
  },
}) => Promise<BaseGetManyResult<Account>>;

export type GetTradeAccountsService = (params: {
  filter: {
    platform: AccountPlatform,
    baseConfig: Partial<AccountConfig>,
    tradeRequest?: {
      redirectUrl: string,
      code: string,
    },
  },
  repositories: {
    account: AccountRepository,
  },
}) => Promise<BaseGetManyResult<Account>>;

export type UpdateAccountService = (params: {
  filter: {
    accountId: string,
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
  repositories: {
    account: AccountRepository
  },
}) => Promise<BaseGetResult<Account>>;

export type AddAccountService = (params: {
  payload: {
    name: string,
    providerType: ProviderType,
    platform: AccountPlatform,
    tradeType: AccountTradeType,
    baseConfig: Partial<AccountConfig>,
  },
  repositories: {
    account: AccountRepository,
  },
}) => Promise<BaseGetResult<Account>>;

export type RemoveAccountService = (params: {
  filter: {
    accountId: string,
  },
  repositories: {
    account: AccountRepository,
  },
}) => Promise<BaseGetResult<Account>>;

export type WatchAccountService = <T>(params: {
  selector: (state: Record<string, Account>) => T,
  repositories: {
    account: AccountRepository,
  },
}) => T;
