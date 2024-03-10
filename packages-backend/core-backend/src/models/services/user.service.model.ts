import {
  User, UserRoles,
} from '@fishprovider/core';

import {
  AccountRepository, BaseGetServiceParams, BaseUpdateServiceParams,
  RepositoryGetManyResult, RepositoryGetResult, UserRepository,
} from '..';

export type GetUserService = (params: BaseGetServiceParams<User> & {
  filter: {
    email?: string,
  },
  repositories: {
    user: UserRepository
  },
}) => Promise<RepositoryGetResult<User>>;

export type GetUsersService = (params: BaseGetServiceParams<User> & {
  filter: {
    pushNotifType?: string
    pushNotifTopic?: string
  },
  repositories: {
    user: UserRepository
  },
}) => Promise<RepositoryGetManyResult<User>>;

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
}) => Promise<RepositoryGetResult<User>>;

export type RefreshUserRolesService = (params: BaseUpdateServiceParams<User> & {
  filter: {
    email?: string,
  },
  repositories: {
    account: AccountRepository
    user: UserRepository
  },
}) => Promise<RepositoryGetResult<User>>;
