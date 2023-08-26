import type { GetUser, User, UserRepository } from '@fishprovider/models';

import { getUser } from './getUser';

export interface UserServiceParams {
  userRepository: UserRepository,
}

export class UserService {
  userRepository: UserRepository;

  constructor(params: UserServiceParams) {
    this.userRepository = params.userRepository;
  }

  getUser: (params: GetUser) => Promise<Partial<User>> = getUser(this);
}
