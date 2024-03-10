import { UserRoles } from '..';

export const getRoleProvider = (
  roles?: UserRoles,
  accountId?: string,
) => {
  if (!roles) return {};

  const isAdmin = roles.admin;
  const isAdminWeb = isAdmin || roles.adminWeb;
  const isManagerWeb = isAdminWeb || roles.managerWeb;

  const isAdminAccount = isAdminWeb
    || (accountId && roles.adminAccounts?.[accountId]);
  const isTraderAccount = isAdminAccount
    || (accountId && roles.traderAccounts?.[accountId]);
  const isProtectorAccount = isAdminAccount
    || (accountId && roles.protectorAccounts?.[accountId]);
  const isViewerAccount = isManagerWeb
    || isTraderAccount
    || isProtectorAccount
    || (accountId && roles.viewerAccounts?.[accountId]);

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
