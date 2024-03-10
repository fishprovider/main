import type { Roles } from '~types/User.model';

const getRoleProvider = (roles?: Roles, providerId?: string) => {
  if (!roles) return {};

  const isAdmin = roles.admin;
  const isAdminWeb = isAdmin || roles.adminWeb;
  const isManagerWeb = isAdminWeb || roles.managerWeb;

  const isAdminAccount = isAdminWeb
    || (providerId && roles.adminAccounts?.[providerId]);
  const isTraderAccount = isAdminAccount
    || (providerId && roles.traderAccounts?.[providerId]);
  const isProtectorAccount = isAdminAccount
    || (providerId && roles.protectorAccounts?.[providerId]);
  const isViewerAccount = isManagerWeb
    || isTraderAccount
    || isProtectorAccount
    || (providerId && roles.viewerAccounts?.[providerId]);

  return {
    isAdmin,
    isAdminWeb,
    isManagerWeb,

    isAdminAccount,
    isTraderAccount,
    isProtectorAccount,
    isViewerAccount,
  };
};

export {
  getRoleProvider,
};
