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
  roles?: UserRoles,
  starProviders?: Record<string, boolean>;
  returnDoc?: boolean,
}

export interface UserRepository {
  getUser: (params: GetUserParams) => Promise<Partial<User> | null>;
  updateUser: (params: UpdateUserParams) => Promise<Partial<User>>;
}

export const userRepositoryDefault: UserRepository = {
  getUser: async () => null,
  updateUser: async () => ({}),
};
