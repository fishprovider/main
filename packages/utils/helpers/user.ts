import type { Roles } from '~types/User.model';

const getRoleProvider = (roles?: Roles, providerId?: string) => {
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

export {
  getRoleProvider,
};
