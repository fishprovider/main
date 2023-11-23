import { Account, User } from '@fishprovider/core';

import {
  BaseGetOptions, BaseGetResult, BaseUpdateOptions, BaseUpdateResult,
} from '..';

export interface UserInfo {
  activeAccount?: Account,
}

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
      refreshRoles?: boolean,
      name?: string,
      starAccount?: {
        accountId: string
        enabled: boolean
      }
      user?: Partial<User>,
    },
    options?: BaseUpdateOptions<User>,
  ) => Promise<BaseUpdateResult<User>>;

  watchUser?: <T>(
    selector: (state: Record<string, User>) => T,
  ) => T;

  watchUserInfo?: <T>(
    selector: (state: Record<string, UserInfo>) => T,
  ) => T;
}
