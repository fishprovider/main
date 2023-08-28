import _ from 'lodash';

import {
  type IUserService,
  ServiceError,
  type UpdateUserService,
} from '../..';

export const updateUser = (
  service: IUserService,
): UpdateUserService => async (params) => {
  const { roles, starProviders, ...rest } = params;
  const { userId, email } = rest;
  if (!(userId || email)) throw new Error(ServiceError.BAD_REQUEST);

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
    return service.repo.updateUser({
      ...rest,
      starProviders,
    });
  }

  return service.repo.updateUser(rest);
};
