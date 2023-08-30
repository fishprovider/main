import type {
  AccountRoles, BaseGetOptions, BaseGetResult, BaseUpdateOptions,
  BaseUpdateResult, User, UserRoles,
} from '../..';

export interface GetUserFilter extends BaseGetOptions<User> {
  userId?: string
  email?: string
}

export interface UpdateUserPayload extends BaseUpdateOptions {
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
  getUser: (
    filter: GetUserFilter
  ) => Promise<BaseGetResult<User>>;

  updateUser: (
    filter: GetUserFilter,
    payload: UpdateUserPayload
  ) => Promise<BaseUpdateResult<User>>;
}
