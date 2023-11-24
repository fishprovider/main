import {
  Account, AccountActivity, AccountBannerStatus, AccountConfig, AccountPlatform,
  AccountProtectSettings, AccountSettings, AccountTradeSettings,
  AccountTradeType, AccountViewType, ProviderType,
} from '@fishprovider/core';

import {
  AccountRepository, BaseGetManyResult, BaseGetResult,
  BaseGetServiceParams, BaseUpdateServiceParams, UserRepository,
} from '..';

export type GetAccountService = (params: BaseGetServiceParams<Account> & {
  filter: {
    accountId: string,
  },
  repositories: {
    account: AccountRepository
  },
}) => Promise<BaseGetResult<Account>>;

export type GetAccountsService = (params: BaseGetServiceParams<Account> & {
  filter: {
    accountViewType?: AccountViewType,
    email?: string,
    accountIds?: string[],
  },
  repositories: {
    account: AccountRepository
  },
}) => Promise<BaseGetManyResult<Account>>;

export type GetTradeAccountService = (params: BaseUpdateServiceParams<Account> & {
  filter: {
    accountId: string,
  },
  repositories: {
    account: AccountRepository,
    trade: AccountRepository,
  },
}) => Promise<BaseGetResult<Account>>;

export type GetTradeAccountsService = (params: BaseUpdateServiceParams<Account> & {
  filter: {
    accountPlatform: AccountPlatform,
    baseConfig: Partial<AccountConfig>,
    tradeRequest?: {
      redirectUrl?: string,
      code?: string,
    },
  },
  repositories: {
    account: AccountRepository,
    trade: AccountRepository,
  },
}) => Promise<BaseGetManyResult<Account>>;

export type UpdateAccountService = (params: BaseUpdateServiceParams<Account> & {
  filter: {
    accountId: string,
  },
  payload: {
    accountViewType?: AccountViewType,
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
  },
  repositories: {
    account: AccountRepository
  },
}) => Promise<BaseGetResult<Account>>;

export type AddAccountService = (params: BaseUpdateServiceParams<Account> & {
  payload: {
    name: string,
    providerType: ProviderType,
    accountPlatform: AccountPlatform,
    accountTradeType: AccountTradeType,
    baseConfig: Partial<AccountConfig>,
  },
  repositories: {
    account: AccountRepository,
    trade: AccountRepository,
    user: UserRepository,
  },
}) => Promise<BaseGetResult<Account>>;

export type RemoveAccountService = (params: BaseUpdateServiceParams<Account> & {
  filter: {
    accountId: string,
  },
  repositories: {
    account: AccountRepository,
    trade: AccountRepository,
    user: UserRepository,
  },
}) => Promise<BaseGetResult<Account>>;
