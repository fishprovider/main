import { UserRoles } from '..';

export const getRoleProvider = (
  roles?: UserRoles,
  accountId?: string,
) => {
  if (!roles) return {};

  const isAdmin = roles.admin;
  const isAdminWeb = isAdmin || roles.adminWeb;
  const isManagerWeb = isAdminWeb || roles.managerWeb;

  const isAdminProvider = isAdminWeb
    || (accountId && roles.adminAccounts?.[accountId]);
  const isTraderProvider = isAdminProvider
    || (accountId && roles.traderAccounts?.[accountId]);
  const isProtectorProvider = isAdminProvider
    || (accountId && roles.protectorAccounts?.[accountId]);
  const isViewerProvider = isManagerWeb
    || isTraderProvider
    || isProtectorProvider
    || (accountId && roles.viewerAccounts?.[accountId]);

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
