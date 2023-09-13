import { User } from '@fishprovider/core';
import {
  AccountRepository, BaseGetManyResult, BaseGetOptions, BaseGetResult,
  BaseUpdateOptions, GetUserFilter, UpdateUserPayload, UserRepository,
} from '@fishprovider/repositories';

import { BaseServiceParams } from '..';

export type GetUserService = (params: BaseServiceParams & {
  filter: GetUserFilter,
  options: BaseGetOptions<User>,
  repositories: {
    user: UserRepository
  },
}) => Promise<BaseGetResult<User>>;

export type GetUsersService = (params: BaseServiceParams & {
  filter: GetUserFilter,
  options: BaseGetOptions<User>,
  repositories: {
    user: UserRepository
  },
}) => Promise<BaseGetManyResult<User>>;

export type UpdateUserService = (params: BaseServiceParams & {
  filter: GetUserFilter,
  payload: UpdateUserPayload,
  options: BaseUpdateOptions<User>,
  repositories: {
    user: UserRepository
  },
}) => Promise<BaseGetResult<User>>;

export type RefreshUserRolesService = (params: BaseServiceParams & {
  options: BaseUpdateOptions<User>,
  repositories: {
    account: AccountRepository
    user: UserRepository
  },
}) => Promise<BaseGetResult<User>>;
