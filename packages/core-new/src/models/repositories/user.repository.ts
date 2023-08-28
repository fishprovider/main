import type {
  AccountRoles, Projection, User, UserRoles,
} from '../..';

interface UserKeys {
  userId?: string
  email?: string
}

export interface GetUserParams extends UserKeys {
  projection?: Projection<User>
}

export interface UpdateUserParams extends UserKeys {
  name?: string
  picture?: string
  starProvider?: {
    accountId: string
    enabled: boolean
  }
  addRole?: {
    accountId: string
    role: AccountRoles
  }
  returnDoc?: boolean
}

export interface RefreshUserRolesParams extends UserKeys {
  roles?: UserRoles
  returnDoc?: boolean
}

export interface UserRepository {
  getUser: (params: GetUserParams) => Promise<Partial<User> | null>;
  updateUser: (params: UpdateUserParams) => Promise<Partial<User>>;
  // create a separate one to avoid human error to update roles, which is an important key
  refreshUserRoles: (params: RefreshUserRolesParams) => Promise<Partial<User>>;
}

export const userRepoDefault: UserRepository = {
  getUser: async () => null,
  updateUser: async () => ({}),
  refreshUserRoles: async () => ({}),
};
