import type { User } from '@fishprovider/core-new';
import _ from 'lodash';

import type { UpdateUserRepositoryParams, UserRepository } from '~repositories';

const updateUserAllowUpdateFields: Array<keyof User> = [
  'name',
  'picture',
  'starProviders',
];

export type UpdateUserUseCaseParams = UpdateUserRepositoryParams;

export class UpdateUserUseCase {
  userRepository: UserRepository;

  constructor(
    userRepository: UserRepository,
  ) {
    this.userRepository = userRepository;
  }

  async run(
    params: UpdateUserUseCaseParams,
  ): Promise<boolean> {
    const { userId, payload } = params;

    const repositoryParams = {
      userId,
      payload: _.pick(payload, updateUserAllowUpdateFields),
    };
    const res = await this.userRepository.updateUser(repositoryParams);
    return res;
  }
}
