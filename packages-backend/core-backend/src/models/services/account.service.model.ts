import {
  Account, AccountActivity, AccountBannerStatus, AccountConfig, AccountMember, AccountPlatform,
  AccountProtectSettings, AccountSettings, AccountTradeSettings, AccountTradeType, AccountViewType,
  ProviderType,
} from '@fishprovider/core';

import {
  AccountRepository, BaseGetServiceParams, BaseUpdateServiceParams, RepositoryGetManyResult,
  RepositoryGetResult, UserRepository,
} from '..';

export type GetAccountService = (params: BaseGetServiceParams<Account> & {
  filter: {
    accountId: string,
  },
  repositories: {
    account: AccountRepository
  },
}) => Promise<RepositoryGetResult<Account>>;

export type GetAccountsService = (params: BaseGetServiceParams<Account> & {
  filter: {
    viewType?: AccountViewType,
    email?: string,
    accountIds?: string[],
  },
  repositories: {
    account: AccountRepository
  },
}) => Promise<RepositoryGetManyResult<Account>>;

export type GetTradeAccountService = (params: BaseUpdateServiceParams<Account> & {
  filter: {
    accountId: string,
  },
  repositories: {
    account: AccountRepository,
    trade: AccountRepository,
  },
}) => Promise<RepositoryGetResult<Account>>;

export type GetTradeAccountsService = (params: BaseUpdateServiceParams<Account> & {
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
    trade: AccountRepository,
  },
}) => Promise<RepositoryGetManyResult<Account>>;

export type UpdateAccountService = (params: BaseUpdateServiceParams<Account> & {
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
    addMember?: AccountMember,
    removeMemberEmail?: string,
  },
  repositories: {
    account: AccountRepository
  },
}) => Promise<RepositoryGetResult<Account>>;

export type AddAccountService = (params: BaseUpdateServiceParams<Account> & {
  payload: {
    name: string,
    providerType: ProviderType,
    platform: AccountPlatform,
    tradeType: AccountTradeType,
    baseConfig: Partial<AccountConfig>,
  },
  repositories: {
    account: AccountRepository,
    trade: AccountRepository,
    user: UserRepository,
  },
}) => Promise<RepositoryGetResult<Account>>;

export type RemoveAccountService = (params: BaseUpdateServiceParams<Account> & {
  filter: {
    accountId: string,
  },
  repositories: {
    account: AccountRepository,
    trade: AccountRepository,
    user: UserRepository,
  },
}) => Promise<RepositoryGetResult<Account>>;
