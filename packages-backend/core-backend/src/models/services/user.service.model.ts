import { User, UserRoles } from '@fishprovider/core';

import {
  AccountRepository, RepositoryGetManyResult, RepositoryGetResult, ServiceGetParams,
  ServiceUpdateParams, UserRepository,
} from '..';

export type GetUserService = (params: ServiceGetParams<User> & {
  filter: {
    email?: string,
  },
  repositories: {
    user: UserRepository
  },
}) => Promise<RepositoryGetResult<User>>;

export type GetUsersService = (params: ServiceGetParams<User> & {
  filter: {
    pushNotifType?: string
    pushNotifTopic?: string
  },
  repositories: {
    user: UserRepository
  },
}) => Promise<RepositoryGetManyResult<User>>;

export type UpdateUserService = (params: ServiceUpdateParams<User> & {
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

export type RefreshUserRolesService = (params: ServiceUpdateParams<User> & {
  filter: {
    email?: string,
  },
  repositories: {
    account: AccountRepository
    user: UserRepository
  },
}) => Promise<RepositoryGetResult<User>>;
