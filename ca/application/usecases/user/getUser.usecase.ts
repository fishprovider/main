import { type User, UserError } from '@fishprovider/core-new';
import _ from 'lodash';

import type { GetUserRepositoryParams, UserRepository } from '~repositories';
import type { Projection } from '~types';

const getUserAllowReadFields: Array<keyof User> = [
  'email',
  'name',
  'picture',
  'starProviders',
  'roles',

  'telegram',

  'updatedAt',
  'createdAt',
];

const getUserAllowReadFieldsProjection = getUserAllowReadFields.reduce<Projection<User>>(
  (acc, field) => {
    acc[field] = 1;
    return acc;
  },
  {},
);

export type GetUserUseCaseParams = GetUserRepositoryParams;

export class GetUserUseCase {
  userRepository: UserRepository;

  constructor(
    userRepository: UserRepository,
  ) {
    this.userRepository = userRepository;
  }

  async run(
    params: GetUserUseCaseParams,
  ): Promise<Partial<User>> {
    const { projection } = params;

    const repositoryParams = {
      ...params,
      projection: {
        ...getUserAllowReadFieldsProjection,
        ..._.pick(projection, getUserAllowReadFields),
      },
    };
    const user = await this.userRepository.getUser(repositoryParams);
    if (!user) {
      throw new Error(UserError.USER_NOT_FOUND);
    }
    return user;
  }
}
