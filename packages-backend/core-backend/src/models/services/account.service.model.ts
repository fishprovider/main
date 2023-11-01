import {
  Account, AccountConfig, AccountMember, AccountPlatform,
  AccountTradeType, AccountType, AccountViewType,
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
    tradeCode: string,
  },
  repositories: {
    account: AccountRepository,
    trade: AccountRepository,
  },
}) => Promise<BaseGetResult<Account>>;

export type UpdateAccountService = (params: BaseUpdateServiceParams<Account> & {
  filter: {
    accountId: string,
  },
  payload: {
    name?: string,
    assetId?: string,
    leverage?: number,
    balance?: number,
    providerData?: any,
    member?: AccountMember,
  },
  repositories: {
    account: AccountRepository
  },
}) => Promise<BaseGetResult<Account>>;

export type AddAccountService = (params: BaseUpdateServiceParams<Account> & {
  payload: {
    name: string,
    accountType: AccountType,
    accountPlatform: AccountPlatform,
    accountTradeType?: AccountTradeType,
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
