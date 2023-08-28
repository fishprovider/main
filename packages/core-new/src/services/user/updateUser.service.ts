import {
  BaseError,
  type IUserService,
  ServiceError,
  type UpdateUserService,
} from '../..';

export const updateUser = (
  service: IUserService,
): UpdateUserService => async (params, roles) => {
  const { userId, email, starProvider } = params;
  if (!(userId || email)) throw new BaseError(ServiceError.SERVICE_BAD_REQUEST);

  if (starProvider) {
    const hasAccess = () => {
      if (!roles) return false;
      if (roles.adminProviders?.[starProvider.accountId] === undefined
        && roles.traderProviders?.[starProvider.accountId] === undefined
        && roles.protectorProviders?.[starProvider.accountId] === undefined
        && roles.viewerProviders?.[starProvider.accountId] === undefined
      ) return false;
      return true;
    };

    return service.repo.updateUser({
      ...params,
      starProvider: {
        ...starProvider,
        enabled: hasAccess() && starProvider.enabled,
      },
    });
  }

  return service.repo.updateUser(params);
};
