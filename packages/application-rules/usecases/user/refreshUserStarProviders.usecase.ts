import type { User } from '@fishprovider/enterprise-rules';
import _ from 'lodash';

import type { UpdateUserRepositoryParams, UserRepository } from '~repositories';

export interface RefreshUserStarProvidersUseCaseParams extends UpdateUserRepositoryParams {
  user: Partial<User>;
}

export class RefreshUserStarProvidersUseCase {
  userRepository: UserRepository;

  constructor(
    userRepository: UserRepository,
  ) {
    this.userRepository = userRepository;
  }

  async run(
    params: RefreshUserStarProvidersUseCaseParams,
  ): Promise<boolean> {
    const { user } = params;

    const roles = user.roles || {};
    const starProviders = user.starProviders || {};

    const providerIds = _.keyBy(_.uniq([
      ..._.keys(roles.adminProviders),
      ..._.keys(roles.traderProviders),
      ..._.keys(roles.protectorProviders),
      ..._.keys(roles.viewerProviders),
    ]));
    _.forEach(starProviders, (enabled, providerId) => {
      if (!enabled || !providerIds[providerId]) {
        _.unset(starProviders, providerId);
      }
    });

    const res = await this.userRepository.updateUser({
      userId: user._id,
      payload: {
        starProviders,
      },
    });
    return res;
  }
}
