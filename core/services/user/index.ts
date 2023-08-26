import { UserRepository } from '@fishprovider/models';

import { getUserUseCase } from './getUser.usecase';

export interface UserServiceParams {
  userRepository: UserRepository,
}

export class UserService {
  userRepository: UserRepository;

  constructor(params: UserServiceParams) {
    this.userRepository = params.userRepository;
  }

  getUser = getUserUseCase(this);
}
