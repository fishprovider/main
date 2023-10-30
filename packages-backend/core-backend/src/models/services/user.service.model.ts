import {
  User, UserRoles,
} from '@fishprovider/core';

import {
  AccountRepository, BaseGetManyResult, BaseGetResult, BaseGetServiceParams,
  BaseUpdateServiceParams, UserRepository,
} from '..';

export type GetUserService = (params: BaseGetServiceParams<User> & {
  filter: {
    email?: string,
  },
  repositories: {
    user: UserRepository
  },
}) => Promise<BaseGetResult<User>>;

export type GetUsersService = (params: BaseGetServiceParams<User> & {
  filter: {
    pushNotifType?: string
    pushNotifTopic?: string
  },
  repositories: {
    user: UserRepository
  },
}) => Promise<BaseGetManyResult<User>>;

export type UpdateUserService = (params: BaseUpdateServiceParams<User> & {
  filter: {
    email?: string,
  },
  payload: {
    name?: string,
    starAccount?: {
      accountId: string,
      enabled: boolean,
    },
    roles?: UserRoles
  },
  repositories: {
    user: UserRepository
  },
}) => Promise<BaseGetResult<User>>;

export type RefreshUserRolesService = (params: BaseUpdateServiceParams<User> & {
  filter: {
    email?: string,
  },
  repositories: {
    account: AccountRepository
    user: UserRepository
  },
}) => Promise<BaseGetResult<User>>;
