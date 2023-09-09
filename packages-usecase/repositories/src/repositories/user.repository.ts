import {
  AccountRoles, User, UserPushNotif, UserRoles,
} from '@fishprovider/core';

import {
  BaseGetManyResult, BaseGetOptions, BaseGetResult, BaseUpdateOptions, BaseUpdateResult,
} from '..';

export interface GetUserFilter {
  userId?: string
  email?: string,
  pushNotif?: Partial<UserPushNotif>,
}

export interface UpdateUserPayload {
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
}

export interface UserRepository {
  getUser?: (
    filter: GetUserFilter,
    options: BaseGetOptions<User>,
  ) => Promise<BaseGetResult<User>>;

  getUsers?: (
    filter: GetUserFilter,
    options: BaseGetOptions<User>,
  ) => Promise<BaseGetManyResult<User>>;

  updateUser?: (
    filter: GetUserFilter,
    payload: UpdateUserPayload,
    options: BaseUpdateOptions<User>,
  ) => Promise<BaseUpdateResult<User>>;
}
