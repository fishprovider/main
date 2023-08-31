import type {
  AccountRoles, BaseGetOptions, BaseGetResult, BaseUpdateOptions,
  BaseUpdateResult, User, UserRoles,
} from '../..';

export interface GetUserFilter {
  userId?: string
  email?: string
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

  updateUser?: (
    filter: GetUserFilter,
    payload: UpdateUserPayload,
    options: BaseUpdateOptions<User>,
  ) => Promise<BaseUpdateResult<User>>;
}
