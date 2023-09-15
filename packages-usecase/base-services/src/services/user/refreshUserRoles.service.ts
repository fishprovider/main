import { AccountRoles, BaseError, UserError } from '@fishprovider/core';
import { RepositoryError } from '@fishprovider/repositories';
import _ from 'lodash';

import {
  getAccountsService, RefreshUserRolesService, sanitizeUserBaseGetOptions,
  updateUserService, validateProjection,
} from '../..';

export const refreshUserRolesService: RefreshUserRolesService = async ({
  options: optionsRaw, repositories, context,
}) => {
  //
  // pre-check
  //
  if (!context?.userSession?._id) throw new BaseError(UserError.USER_ACCESS_DENIED);

  //
  // main
  //
  const { userSession } = context;
  const { _id: userId, email, roles = {} } = userSession;

  // cleanDisabledProviders
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

  // cleanRoleProviders
  const accountIds = _.uniq([
    ..._.keys(roles.adminProviders),
    ..._.keys(roles.traderProviders),
    ..._.keys(roles.protectorProviders),
    ..._.keys(roles.viewerProviders),
  ]);
  const { docs: accounts } = await getAccountsService({
    filter: {
      accountIds,
      memberId: userId,
    },
    options: {
      projection: {
        _id: 1,
        members: 1,
      },
    },
    repositories,
    context,
  });

  for (const accountId of accountIds) {
    const account = accounts?.find((item) => item._id === accountId);
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

  const options = sanitizeUserBaseGetOptions(optionsRaw);

  const { doc: user } = await updateUserService({
    filter: { userId, email },
    payload: { roles },
    options,
    repositories,
  });

  if (user && !validateProjection(options.projection, user)) {
    throw new BaseError(RepositoryError.REPOSITORY_BAD_RESULT, 'projection', user._id);
  }

  return { doc: user };
};
