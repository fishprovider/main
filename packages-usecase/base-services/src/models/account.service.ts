import { Account } from '@fishprovider/core';
import {
  AccountRepository, BaseGetManyResult, BaseGetOptions, BaseGetResult,
  BaseUpdateOptions, GetAccountFilter, UpdateAccountPayload, UserRepository,
} from '@fishprovider/repositories';

import { BaseServiceParams } from '..';

export type GetAccountService = (params: BaseServiceParams & {
  filter: GetAccountFilter,
  options: BaseGetOptions<Account>,
  repositories: {
    account: AccountRepository
  },
}) => Promise<BaseGetResult<Account>>;

export type GetAccountsService = (params: BaseServiceParams & {
  filter: GetAccountFilter,
  options: BaseGetOptions<Account>,
  repositories: {
    account: AccountRepository
  },
}) => Promise<BaseGetManyResult<Account>>;

export type UpdateAccountService = (params: BaseServiceParams & {
  filter: GetAccountFilter,
  payload: UpdateAccountPayload,
  options: BaseUpdateOptions<Account>,
  repositories: {
    account: AccountRepository
  },
}) => Promise<BaseGetResult<Account>>;

export type JoinAccountService = (params: BaseServiceParams & {
  filter: GetAccountFilter,
  options: BaseUpdateOptions<Account>,
  repositories: {
    account: AccountRepository
    user: UserRepository,
  },
}) => Promise<BaseGetResult<Account>>;
