import type { User } from '@fishprovider/enterprise-rules';
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

  async runInternal(
    params: UpdateUserUseCaseParams,
  ): Promise<boolean> {
    const res = await this.userRepository.updateUser(params);
    return res;
  }

  async run(
    params: UpdateUserUseCaseParams,
  ): Promise<boolean> {
    const { userId, payload } = params;

    const repositoryParams = {
      userId,
      payload: _.pick(payload, updateUserAllowUpdateFields),
    };
    return this.runInternal(repositoryParams);
  }
}
