import type { User } from '@fishprovider/enterprise-rules';

import type { Projection } from '~types/Repository';

export interface GetUserRepositoryParams {
  _id: string,
  projection?: Projection<User>,
}

export interface UpdateUserRepositoryParams {
  _id: string,
  payload: Partial<Omit<User, '_id'>>,
}

export interface UserRepository {
  getUser: (params: GetUserRepositoryParams) => Promise<User>;
  updateUser: (params: UpdateUserRepositoryParams) => Promise<boolean>;
}
