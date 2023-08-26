import type { UserRepository } from '@fishprovider/models';

import { getUser } from './getUser';
import { updateUser } from './updateUser';

export interface UserServiceParams {
  userRepository: UserRepository,
}

export class UserService {
  userRepository: UserRepository;

  constructor(params: UserServiceParams) {
    this.userRepository = params.userRepository;
  }

  getUser = getUser(this);
  updateUser = updateUser(this);
}
