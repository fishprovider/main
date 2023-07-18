import type { User } from '@fishprovider/enterprise-rules';

export interface GetUserRepositoryParams {
  _id: string,
}

export interface UpdateUserRepositoryParams {
  _id: string,
  payload: Partial<Omit<User, '_id'>>,
}

export interface UserRepository {
  getUser: (params: GetUserRepositoryParams) => Promise<User>;
  updateUser: (params: UpdateUserRepositoryParams) => Promise<boolean | User>;
}
