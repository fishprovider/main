import { type Projection } from '../repository';
import { type User } from '.';

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
  getUser: (params: GetUserRepositoryParams) => Promise<Partial<User> | null>;
  updateUser: (params: UpdateUserRepositoryParams) => Promise<boolean>;
}
