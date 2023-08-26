import {
  ServiceError,
  type UpdateUserParams,
} from '@fishprovider/models';
import _ from 'lodash';

import { UserService } from '.';

export const updateUser = (userService: UserService) => async (
  params: UpdateUserParams,
) => {
  const { roles, starProviders, ...rest } = params;
  const { userId, email } = rest;
  if (!(userId || email)) throw new Error(ServiceError.BAD_REQUEST);

  const { userRepository } = userService;

  if (starProviders) {
    if (!roles) throw new Error(ServiceError.BAD_REQUEST);

    const userRoleProviderIds = _.keyBy(_.uniq([
      ..._.keys(roles.adminProviders),
      ..._.keys(roles.traderProviders),
      ..._.keys(roles.protectorProviders),
      ..._.keys(roles.viewerProviders),
    ]));
    _.forEach(starProviders, (enabled, providerId) => {
      if (!enabled || !userRoleProviderIds[providerId]) {
        _.unset(starProviders, providerId);
      }
    });
    return userRepository.updateUser({
      ...rest,
      starProviders,
    });
  }

  return userRepository.updateUser(rest);
};
