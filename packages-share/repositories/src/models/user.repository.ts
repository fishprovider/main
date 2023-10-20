import { User, UserRoles } from '@fishprovider/core';

import {
  BaseGetManyResult, BaseGetOptions, BaseGetResult, BaseUpdateOptions, BaseUpdateResult,
} from '..';

export interface UserRepository {
  getUser?: (
    filter: {
      email?: string,
    },
    options?: BaseGetOptions<User>,
  ) => Promise<BaseGetResult<User>>;

  getUsers?: (
    filter: {
      pushNotifType?: string
      pushNotifTopic?: string
    },
    options?: BaseGetOptions<User>,
  ) => Promise<BaseGetManyResult<User>>;

  updateUser?: (
    filter: {
      email?: string,
    },
    payload: {
      name?: string
      starAccount?: {
        accountId: string
        enabled: boolean
      }
      roles?: UserRoles
      // local
      doc?: Partial<User>,
    },
    options?: BaseUpdateOptions<User>,
  ) => Promise<BaseUpdateResult<User>>;

}
