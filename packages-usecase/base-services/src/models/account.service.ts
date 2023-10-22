import {
  Account, AccountMember, AccountViewType,
} from '@fishprovider/core';
import {
  AccountRepository, BaseGetManyResult, BaseGetResult,
} from '@fishprovider/repositories';

import { BaseGetServiceParams, BaseUpdateServiceParams } from '..';

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
    accountIds?: string[],
    accountViewType?: AccountViewType,
    email?: string,
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

// export type GetTradeAccountsService = (params: BaseUpdateServiceParams<Account> & {
//   filter: {
//     tradeCode: string,
//   },
//   repositories: {
//     account: AccountRepository,
//     trade: AccountRepository,
//   },
// }) => Promise<BaseGetResult<Account>>;

export type UpdateAccountService = (params: BaseUpdateServiceParams<Account> & {
  filter: {
    accountId: string,
  },
  payload: {
    name?: string,
    // trade
    assetId?: string,
    leverage?: number,
    balance?: number,
    providerData?: any,
    // members
    member?: AccountMember,
  },
  repositories: {
    account: AccountRepository
  },
}) => Promise<BaseGetResult<Account>>;
