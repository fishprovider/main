import type { AccountRepository, UserRepository } from '@fishprovider/models';

import { getUser } from './getUser';
import { updateUser } from './updateUser';
import { updateUserRoles } from './updateUserRoles';

export interface UserServiceParams {
  userRepository: UserRepository,
  accountRepository?: AccountRepository,
}

export class UserService {
  userRepository: UserRepository;
  accountRepository?: AccountRepository;

  constructor(params: UserServiceParams) {
    this.userRepository = params.userRepository;
    this.accountRepository = params.accountRepository;
  }

  getUser = getUser(this);
  updateUser = updateUser(this);
  updateUserRoles = updateUserRoles(this);
}
