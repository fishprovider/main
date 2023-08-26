import type { AccountRoles } from '../account';
import type { Projection } from '../repository';
import type { User, UserRoles } from '.';

interface UserKeys {
  userId?: string,
  email?: string,
}

export interface GetUserParams extends UserKeys {
  projection?: Projection<User>,
}

export interface UpdateUserParams extends UserKeys {
  name?: string,
  picture?: string,
  returnDoc?: boolean,
}

export interface UpdateUserAccountRoleParams extends UserKeys {
  accountId: string,
  role: AccountRoles,
  returnDoc?: boolean,
}

export interface UpdateUserStarProvidersParams extends UserKeys {
  accountId: string[],
  returnDoc?: boolean,
}

export interface RefreshUserRolesParams extends UserKeys {
  roles: UserRoles,
  returnDoc?: boolean,
}

export interface UserRepository {
  getUser: (params: GetUserParams) => Promise<Partial<User> | null>;
  updateUser: (params: UpdateUserParams) => Promise<Partial<User>>;
  updateUserAccountRole: (params: UpdateUserAccountRoleParams) => Promise<Partial<User>>;
  updateUserStarProviders: (params: UpdateUserStarProvidersParams) => Promise<Partial<User>>;
  refreshUserRoles: (params: RefreshUserRolesParams) => Promise<Partial<User>>;
}

export const userRepositoryDefault: UserRepository = {
  getUser: async () => null,
  updateUser: async () => ({}),
  updateUserAccountRole: async () => ({}),
  updateUserStarProviders: async () => ({}),
  refreshUserRoles: async () => ({}),
};
