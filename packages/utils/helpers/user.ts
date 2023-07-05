import type { Roles } from '~types/User.model';

const getRoleProvider = (roles?: Roles, providerId?: string) => {
  if (!roles) return {};

  const isAdmin = roles.admin;
  const isAdminWeb = isAdmin || roles.adminWeb;
  const isManagerWeb = isAdminWeb || roles.managerWeb;

  const isAdminProvider = isAdminWeb
    || (providerId && roles.adminProviders?.[providerId]);
  const isTraderProvider = isAdminProvider
    || (providerId && roles.traderProviders?.[providerId]);
  const isProtectorProvider = isAdminProvider
    || (providerId && roles.protectorProviders?.[providerId]);
  const isViewerProvider = isManagerWeb
    || isTraderProvider
    || isProtectorProvider
    || (providerId && roles.viewerProviders?.[providerId]);

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
