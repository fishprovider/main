import type { User } from '@fishprovider/enterprise-rules';

import { type Projection, RepositoryError } from '~types';

export interface GetUserRepositoryParams {
  userId: string,
  projection?: Projection<User>,
}

export interface UpdateUserRepositoryParams {
  userId?: string,
  email?: string,
  payload?: Record<string, any>,
  payloadDelete?: Record<string, any>,
  returnDoc?: boolean,
}

export interface UserRepository {
  getUser: (
    params: GetUserRepositoryParams) => Promise<User | null>;
  updateUser: (
    params: UpdateUserRepositoryParams) => Promise<Partial<User> | boolean>;
}

export const DefaultUserRepository: UserRepository = {
  getUser: () => {
    throw new Error(RepositoryError.NOT_IMPLEMENTED);
  },
  updateUser: () => {
    throw new Error(RepositoryError.NOT_IMPLEMENTED);
  },
};
