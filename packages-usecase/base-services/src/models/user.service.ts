import { AccountRoles, User, UserRoles } from '@fishprovider/core';
import {
  AccountRepository, BaseGetManyResult, BaseGetResult, UserRepository,
} from '@fishprovider/repositories';

import { BaseGetServiceParams, BaseUpdateServiceParams } from '..';

export type GetUserService = (params: BaseGetServiceParams<User> & {
  filter: {
    userId?: string
    email?: string,
  },
  repositories: {
    user: UserRepository
  },
}) => Promise<BaseGetResult<User>>;

export type UpdateUserService = (params: BaseUpdateServiceParams<User> & {
  filter: {
    userId?: string
    email?: string,
  },
  payload: {
    name?: string
    picture?: string
    roles?: UserRoles
    starProvider?: {
      accountId: string
      enabled: boolean
    }
    addRole?: {
      accountId: string
      role: AccountRoles
    },
  },
  repositories: {
    user: UserRepository
  },
}) => Promise<BaseGetResult<User>>;

export type RefreshUserRolesService = (params: BaseUpdateServiceParams<User> & {
  repositories: {
    account: AccountRepository
    user: UserRepository
  },
}) => Promise<BaseGetResult<User>>;

export type GetUsersService = (params: BaseGetServiceParams<User> & {
  filter: {
    // TODO
  },
  repositories: {
    user: UserRepository
  },
}) => Promise<BaseGetManyResult<User>>;
