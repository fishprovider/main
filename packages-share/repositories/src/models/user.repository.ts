import {
  AccountRoles, User, UserRoles,
} from '@fishprovider/core';

import {
  BaseGetManyResult, BaseGetOptions, BaseGetResult, BaseUpdateOptions, BaseUpdateResult,
} from '..';

export interface UserRepository {
  getUser?: (
    filter: {
      userId?: string
      email?: string,
    },
    options?: BaseGetOptions<User>,
  ) => Promise<BaseGetResult<User>>;

  updateUser?: (
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
    options?: BaseUpdateOptions<User>,
  ) => Promise<BaseUpdateResult<User>>;

  getUsers?: (
    filter: {
      // TODO
    },
    options?: BaseGetOptions<User>,
  ) => Promise<BaseGetManyResult<User>>;
}
