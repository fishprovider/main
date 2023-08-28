import _ from 'lodash';

import {
  AccountRoles,
  type IUserService,
  type RefreshUserRolesService,
  ServiceError,
  ServiceName,
} from '../..';

export const refreshUserRoles = (
  service: IUserService,
): RefreshUserRolesService => async (params) => {
  const { userId, roles } = params;
  if (!userId || !roles) throw new Error(ServiceError.BAD_REQUEST);

  const cleanDisabledProviders = () => {
    _.forEach(roles.adminProviders, (enabled, accountId) => {
      if (!enabled) {
        _.unset(roles.adminProviders, accountId);
      }
    });
    _.forEach(roles.traderProviders, (enabled, accountId) => {
      if (!enabled) {
        _.unset(roles.traderProviders, accountId);
      }
    });
    _.forEach(roles.protectorProviders, (enabled, accountId) => {
      if (!enabled) {
        _.unset(roles.protectorProviders, accountId);
      }
    });
    _.forEach(roles.viewerProviders, (enabled, accountId) => {
      if (!enabled) {
        _.unset(roles.viewerProviders, accountId);
      }
    });
  };
  cleanDisabledProviders();

  const cleanRoleProviders = async () => {
    const accountIds = _.uniq([
      ..._.keys(roles.adminProviders),
      ..._.keys(roles.traderProviders),
      ..._.keys(roles.protectorProviders),
      ..._.keys(roles.viewerProviders),
    ]);

    const accountService = service.getService(ServiceName.account);
    if (!accountService) throw new Error(ServiceError.BAD_REQUEST);

    for (const accountId of accountIds) {
      const account = await accountService.repo.getAccount({
        accountId,
        memberId: userId,
        projection: {
          members: 1,
        },
      });
      if (!account) {
        _.unset(roles.adminProviders, accountId);
        _.unset(roles.traderProviders, accountId);
        _.unset(roles.protectorProviders, accountId);
        _.unset(roles.viewerProviders, accountId);
      } else {
        const { members } = account;
        const member = _.find(members, (item) => item.userId === userId);
        switch (member?.role) {
          case AccountRoles.admin: {
            _.unset(roles.traderProviders, accountId);
            _.unset(roles.protectorProviders, accountId);
            _.unset(roles.viewerProviders, accountId);
            break;
          }
          case AccountRoles.trader: {
            _.unset(roles.adminProviders, accountId);
            _.unset(roles.protectorProviders, accountId);
            _.unset(roles.viewerProviders, accountId);
            break;
          }
          case AccountRoles.protector: {
            _.unset(roles.adminProviders, accountId);
            _.unset(roles.traderProviders, accountId);
            _.unset(roles.viewerProviders, accountId);
            break;
          }
          case AccountRoles.viewer: {
            _.unset(roles.adminProviders, accountId);
            _.unset(roles.traderProviders, accountId);
            _.unset(roles.protectorProviders, accountId);
            break;
          }
          default:
        }
      }
    }
  };
  await cleanRoleProviders();

  return service.repo.updateUser({ userId, roles });
};
