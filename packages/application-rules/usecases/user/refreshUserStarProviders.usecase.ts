import type { User } from '@fishprovider/enterprise-rules';
import _ from 'lodash';

import type { UpdateUserRepositoryParams, UserRepository } from './_user.repository';

export interface RefreshUserStarProvidersUseCaseParams extends UpdateUserRepositoryParams {
  user: Partial<User>;
}

export type RefreshUserStarProvidersUseCase = (
  params: RefreshUserStarProvidersUseCaseParams
) => Promise<boolean>;

export const refreshUserStarProvidersUseCase = (
  userRepository: UserRepository,
): RefreshUserStarProvidersUseCase => async (
  params: RefreshUserStarProvidersUseCaseParams,
) => {
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

  const res = await userRepository.updateUser({
    userId: user._id,
    payload: {
      starProviders,
    },
  });
  return res;
};
