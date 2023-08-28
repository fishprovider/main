import { type Projection, RepositoryError, User } from '@fishprovider/core-new';

export interface GetUserRepositoryParams {
  userId: string,
  projection?: Projection<User>,
}

export interface UpdateUserRepositoryParams {
  userId?: string,
  email?: string,
  payload?: Record<string, any>,
  payloadDelete?: Record<string, any>,
}

export interface UserRepository {
  getUser: (
    params: GetUserRepositoryParams) => Promise<Partial<User> | null>;
  updateUser: (
    params: UpdateUserRepositoryParams) => Promise<boolean>;
}

export const DefaultUserRepository: UserRepository = {
  getUser: () => {
    throw new Error(RepositoryError.NOT_IMPLEMENTED);
  },
  updateUser: () => {
    throw new Error(RepositoryError.NOT_IMPLEMENTED);
  },
};
