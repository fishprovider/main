import { Account } from '@fishprovider/core';
import {
  AccountRepository, BaseGetOptions, BaseUpdateOptions, GetAccountFilter,
  UpdateAccountPayload, UserRepository,
} from '@fishprovider/repositories';

import { BaseServiceGetManyResult, BaseServiceGetResult, BaseServiceParams } from '..';

export type GetAccountService = (params: BaseServiceParams & {
  filter: GetAccountFilter,
  options: BaseGetOptions<Account>,
  repositories: {
    account: AccountRepository
  },
}) => Promise<BaseServiceGetResult<Account>>;

export type GetAccountsService = (params: BaseServiceParams & {
  filter: GetAccountFilter,
  options: BaseGetOptions<Account>,
  repositories: {
    account: AccountRepository
  },
}) => Promise<BaseServiceGetManyResult<Account>>;

export type UpdateAccountService = (params: BaseServiceParams & {
  filter: GetAccountFilter,
  payload: UpdateAccountPayload,
  options: BaseUpdateOptions<Account>,
  repositories: {
    account: AccountRepository
  },
}) => Promise<BaseServiceGetResult<Account>>;

export type JoinAccountService = (params: BaseServiceParams & {
  filter: GetAccountFilter,
  options: BaseUpdateOptions<Account>,
  repositories: {
    account: AccountRepository
    user: UserRepository,
  },
}) => Promise<BaseServiceGetResult<Account>>;
