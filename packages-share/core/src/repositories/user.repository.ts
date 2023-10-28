import {
  BaseGetManyResult, BaseGetOptions, BaseGetResult, BaseUpdateOptions, BaseUpdateResult,
  User, UserRoles,
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
