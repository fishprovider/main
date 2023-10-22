import {
  BaseError, User, UserError, UserRoles,
} from '@fishprovider/core';

import { UserSession } from '..';

export const sanitizeOutputUser = (user: Partial<User>) => ({
  ...user,
  pushNotif: undefined,
});

export const getRoleProvider = (
  roles?: UserRoles,
  providerId?: string,
) => {
  if (!roles) return {};

  const isAdmin = roles.admin;
  const isAdminWeb = isAdmin || roles.adminWeb;
  const isManagerWeb = isAdminWeb || roles.managerWeb;

  const isAdminProvider = isAdminWeb
    || (providerId && roles.adminAccounts?.[providerId]);
  const isTraderProvider = isAdminProvider
    || (providerId && roles.traderAccounts?.[providerId]);
  const isProtectorProvider = isAdminProvider
    || (providerId && roles.protectorAccounts?.[providerId]);
  const isViewerProvider = isManagerWeb
    || isTraderProvider
    || isProtectorProvider
    || (providerId && roles.viewerAccounts?.[providerId]);

  return {
    isAdmin,
    isAdminWeb,
    isManagerWeb,

    isAdminProvider,
    isTraderProvider,
    isProtectorProvider,
    isViewerProvider,
  };
};

//
// check functions
//

export const checkLogin = (userSession?: UserSession) => {
  if (!userSession?._id) {
    throw new BaseError(UserError.USER_ACCESS_DENIED);
  }
  return userSession;
};
