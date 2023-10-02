import {
  Account, AccountFull, AccountMember, AccountViewType,
} from '@fishprovider/core';
import {
  AccountRepository, BaseGetManyResult, BaseGetResult,
} from '@fishprovider/repositories';

import { BaseGetServiceParams, BaseUpdateServiceParams } from '..';

export type GetAccountService = (params: BaseGetServiceParams<AccountFull> & {
  filter: {
    accountId: string,
  },
  repositories: {
    account: AccountRepository
  },
}) => Promise<BaseGetResult<AccountFull>>;

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
