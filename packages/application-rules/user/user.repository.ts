import type { User } from '@fishprovider/enterprise-rules';

export interface UserRepository {
  getUser: () => Promise<User[]>;
  updateUser: (params: {
    _id: string,
    payload: Partial<Omit<User, '_id'>>,
    options?: {
      returnAfter?: boolean,
    },
  }) => Promise<boolean | User>;
}
