import {
  Account, AccountConfig, AccountMember, AccountViewType,
} from '@fishprovider/core';
import {
  AccountRepository, BaseGetManyResult, BaseGetResult, UserRepository,
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

export type UpdateAccountService = (params: BaseUpdateServiceParams<Account> & {
  filter: {
    accountId: string,
  },
  payload: {
    name?: string,
    addMember?: AccountMember,
    removeMemberId?: string,
    removeMemberInviteEmail?: string,
  },
  repositories: {
    account: AccountRepository
  },
}) => Promise<BaseGetResult<Account>>;

export type JoinAccountService = (params: BaseUpdateServiceParams<Account> & {
  filter: {
    accountId: string,
    email: string,
  },
  repositories: {
    account: AccountRepository
    user: UserRepository,
  },
}) => Promise<BaseGetResult<Account>>;

export type GetBrokerAccountService = (params: BaseUpdateServiceParams<Account> & {
  filter: {
    config: AccountConfig,
  },
  repositories: {
    account: AccountRepository,
    broker: AccountRepository,
  },
}) => Promise<BaseGetResult<Account>>;

export type GetAccountsService = (params: BaseGetServiceParams<Account> & {
  filter: {
    accountIds?: string[],
    accountViewType?: AccountViewType,
    memberId?: string,
    email?: string,
  },
  repositories: {
    account: AccountRepository
  },
}) => Promise<BaseGetManyResult<Account>>;
