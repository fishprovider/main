import { AccountRoles } from '@fishprovider/core';
import _ from 'lodash';

import {
  checkLogin, checkProjection, getAccountsService, RefreshUserRolesService,
  sanitizeUserBaseGetOptions, updateUserService,
} from '../..';

export const refreshUserRolesService: RefreshUserRolesService = async ({
  options: optionsRaw, repositories, context,
}) => {
  //
  // pre-check
  //
  const userSession = checkLogin(context?.userSession);

  //
  // main
  //
  const { email, roles = {} } = userSession;

  // remove disabled
  _.forEach(roles.adminAccounts, (enabled, accountId) => {
    if (!enabled) {
      _.unset(roles.adminAccounts, accountId);
    }
  });
  _.forEach(roles.traderAccounts, (enabled, accountId) => {
    if (!enabled) {
      _.unset(roles.traderAccounts, accountId);
    }
  });
  _.forEach(roles.protectorAccounts, (enabled, accountId) => {
    if (!enabled) {
      _.unset(roles.protectorAccounts, accountId);
    }
  });
  _.forEach(roles.viewerAccounts, (enabled, accountId) => {
    if (!enabled) {
      _.unset(roles.viewerAccounts, accountId);
    }
  });
  _.forEach(roles.adminAccounts, (enabled, accountId) => {
    if (!enabled) {
      _.unset(roles.adminAccounts, accountId);
    }
  });
  _.forEach(roles.traderAccounts, (enabled, accountId) => {
    if (!enabled) {
      _.unset(roles.traderAccounts, accountId);
    }
  });
  _.forEach(roles.protectorAccounts, (enabled, accountId) => {
    if (!enabled) {
      _.unset(roles.protectorAccounts, accountId);
    }
  });
  _.forEach(roles.viewerAccounts, (enabled, accountId) => {
    if (!enabled) {
      _.unset(roles.viewerAccounts, accountId);
    }
  });

  // clean roles
  const accountIds = _.uniq([
    ..._.keys(roles.adminAccounts),
    ..._.keys(roles.traderAccounts),
    ..._.keys(roles.protectorAccounts),
    ..._.keys(roles.viewerAccounts),
  ]);
  const { docs: accounts } = await getAccountsService({
    filter: {
      email,
      accountIds,
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
      _.unset(roles.adminAccounts, accountId);
      _.unset(roles.traderAccounts, accountId);
      _.unset(roles.protectorAccounts, accountId);
      _.unset(roles.viewerAccounts, accountId);
    } else {
      const { members } = account;
      const member = _.find(members, (item) => item.email === email);
      switch (member?.role) {
        case AccountRoles.admin: {
          _.unset(roles.traderAccounts, accountId);
          _.unset(roles.protectorAccounts, accountId);
          _.unset(roles.viewerAccounts, accountId);
          break;
        }
        case AccountRoles.trader: {
          _.unset(roles.adminAccounts, accountId);
          _.unset(roles.protectorAccounts, accountId);
          _.unset(roles.viewerAccounts, accountId);
          break;
        }
        case AccountRoles.protector: {
          _.unset(roles.adminAccounts, accountId);
          _.unset(roles.traderAccounts, accountId);
          _.unset(roles.viewerAccounts, accountId);
          break;
        }
        case AccountRoles.viewer: {
          _.unset(roles.adminAccounts, accountId);
          _.unset(roles.traderAccounts, accountId);
          _.unset(roles.protectorAccounts, accountId);
          break;
        }
        default:
      }
    }
  }

  const options = sanitizeUserBaseGetOptions(optionsRaw);

  const { doc: user } = await updateUserService({
    filter: {
      email,
    },
    payload: {
      roles,
    },
    options,
    repositories,
  });

  checkProjection(options?.projection, user);

  return { doc: user };
};
