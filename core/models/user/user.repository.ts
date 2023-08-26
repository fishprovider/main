import type { AccountRoles } from '../account';
import type { Projection } from '../repository';
import type { User, UserRoles } from '.';

export interface UserKeys {
  userId?: string,
  email?: string,
}

export interface GetUser extends UserKeys {
  projection?: Projection<User>,
}

export interface UpdateUser extends UserKeys {
  name?: string,
  picture?: string,
}

export interface UpdateUserAccountRole extends UserKeys {
  accountId: string,
  role: AccountRoles,
}

export interface UpdateUserStarProviders extends UserKeys {
  accountId: string[],
}

export interface RefreshUserRoles extends UserKeys {
  roles: UserRoles,
}

export interface UserRepository {
  getUser: (params: GetUser) => Promise<Partial<User> | null>;
  updateUser: (params: UpdateUser) => Promise<boolean>;
  updateUserAccountRole: (params: UpdateUserAccountRole) => Promise<boolean>;
  updateUserStarProviders: (params: UpdateUserStarProviders) => Promise<boolean>;
  refreshUserRoles: (params: RefreshUserRoles) => Promise<boolean>;
}

export const userRepositoryDefault: UserRepository = {
  getUser: async () => null,
  updateUser: async () => false,
  updateUserAccountRole: async () => false,
  updateUserStarProviders: async () => false,
  refreshUserRoles: async () => false,
};
