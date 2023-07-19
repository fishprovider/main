import type { User } from '@fishprovider/enterprise-rules';

import type { Projection } from '~types/Repository';

export interface GetUserRepositoryParams {
  userId: string,
  projection?: Projection<User>,
}

export interface UpdateUserRepositoryParams {
  userId: string,
  payload: Partial<Omit<User, '_id'>>,
}

export interface UserRepository {
  getUser: (params: GetUserRepositoryParams) => Promise<User>;
  updateUser: (params: UpdateUserRepositoryParams) => Promise<boolean>;
}
