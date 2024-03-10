import { AccountRole, User, UserRoles } from '@fishprovider/core';

import {
  RepositoryGetManyResult, RepositoryGetOptions, RepositoryGetResult, RepositoryUpdateOptions,
  RepositoryUpdateResult,
} from '..';

export interface UserRepository {
  getUser?: (
    filter: {
      email?: string,
    },
    options?: RepositoryGetOptions<User>,
  ) => Promise<RepositoryGetResult<User>>;

  getUsers?: (
    filter: {
      pushNotifType?: string
      pushNotifTopic?: string
    },
    options?: RepositoryGetOptions<User>,
  ) => Promise<RepositoryGetManyResult<User>>;

  updateUser?: (
    filter: {
      email?: string,
    },
    payload: {
      name?: string,
      starAccount?: {
        accountId: string
        enabled: boolean
      }
      roles?: UserRoles,
      addRole?: {
        role: AccountRole,
        accountId: string,
      },
      removeRole?: {
        role: AccountRole,
        accountId: string,
      },
    },
    options?: RepositoryUpdateOptions<User>,
  ) => Promise<RepositoryUpdateResult<User>>;

  updateUsers?: (
    filter: {
      emails?: string[],
    },
    payload: {
      removeRoleAccountId?: string,
    },
    options?: RepositoryUpdateOptions<User>,
  ) => Promise<RepositoryGetManyResult<User>>;
}
