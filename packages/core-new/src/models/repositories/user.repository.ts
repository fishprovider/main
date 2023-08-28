import type {
  AccountRoles, BaseGetParams, BaseUpdateParams, User, UserRoles,
} from '../..';

export interface UserBaseGetParams extends BaseGetParams<User> {
  userId?: string
  email?: string
}

export interface UserBaseUpdateParams extends BaseUpdateParams, UserBaseGetParams {
}

export interface GetUserParams extends UserBaseGetParams {
}

export interface UpdateUserParams extends UserBaseUpdateParams {
  name?: string
  picture?: string
  starProvider?: {
    accountId: string
    enabled: boolean
  }
  addRole?: {
    accountId: string
    role: AccountRoles
  },
  roles?: UserRoles
}

export interface UserRepository {
  getUser: (params: GetUserParams) => Promise<Partial<User> | null>;
  updateUser: (params: UpdateUserParams) => Promise<Partial<User>>;
}
