import {
  User, UserRoles,
} from '@fishprovider/core';

import {
  BaseGetOptions, BaseGetResult, BaseUpdateOptions, BaseUpdateResult,
} from '..';

export interface UserRepository {
  getUser?: (
    filter: {
      email?: string,
    },
    options?: BaseGetOptions<User>,
  ) => Promise<BaseGetResult<User>>;

  updateUser?: (
    filter: {
      email?: string,
    },
    payload: {
      starAccount?: {
        accountId: string
        enabled: boolean
      }
      refreshRoles?: boolean
      roles?: UserRoles
      // local
      doc?: Partial<User>,
    },
    options?: BaseUpdateOptions<User>,
  ) => Promise<BaseUpdateResult<User>>;
}
