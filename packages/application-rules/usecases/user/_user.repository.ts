import type { User } from '@fishprovider/enterprise-rules';

import type { Projection } from '~types';

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
  getUser: (params: GetUserRepositoryParams) => Promise<User | undefined>;
  updateUser: (params: UpdateUserRepositoryParams) => Promise<boolean>;
}
