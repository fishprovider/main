import {
  Account, AccountActivity, AccountBannerStatus, AccountConfig, AccountMember, AccountPlatform,
  AccountProtectSettings, AccountSettings, AccountTradeSettings, AccountTradeType, AccountViewType,
  ProviderType,
} from '@fishprovider/core';

import {
  AccountRepository, RepositoryGetManyResult, RepositoryGetResult,
  ServiceGetParams, ServiceUpdateParams, UserRepository,
} from '..';

export type GetAccountService = (params: ServiceGetParams<Account> & {
  filter: {
    accountId: string,
  },
  repositories: {
    account: AccountRepository
  },
}) => Promise<RepositoryGetResult<Account>>;

export type GetAccountsService = (params: ServiceGetParams<Account> & {
  filter: {
    accountIds?: string[],
    email?: string,
    viewType?: AccountViewType,
  },
  repositories: {
    account: AccountRepository
  },
}) => Promise<RepositoryGetManyResult<Account>>;

export type GetTradeAccountService = (params: ServiceUpdateParams<Account> & {
  filter: {
    accountId: string,
  },
  repositories: {
    account: AccountRepository,
    trade: AccountRepository,
  },
}) => Promise<RepositoryGetResult<Account>>;

export type GetTradeAccountsService = (params: ServiceUpdateParams<Account> & {
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

export type UpdateAccountService = (params: ServiceUpdateParams<Account> & {
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

export type AddAccountService = (params: ServiceUpdateParams<Account> & {
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

export type RemoveAccountService = (params: ServiceUpdateParams<Account> & {
  filter: {
    accountId: string,
  },
  repositories: {
    account: AccountRepository,
    trade: AccountRepository,
    user: UserRepository,
  },
}) => Promise<RepositoryGetResult<Account>>;
