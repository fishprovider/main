import {
  BaseError,
  type IUserService,
  ServiceError,
  type UpdateUserService,
  UserError,
} from '../..';

export const updateUser = (
  service: IUserService,
): UpdateUserService => async (params, userSession) => {
  if (!userSession._id) throw new BaseError(UserError.USER_ACCESS_DENIED);

  const { userId, email, starProvider } = params;
  if (!(userId || email)) throw new BaseError(ServiceError.SERVICE_BAD_REQUEST);

  if (starProvider) {
    const { roles } = userSession;
    const { accountId, enabled } = starProvider;

    const hasAccess = () => {
      if (!roles) return false;
      const {
        adminProviders, traderProviders, protectorProviders, viewerProviders,
      } = roles;
      if (adminProviders?.[accountId] === undefined
        && traderProviders?.[accountId] === undefined
        && protectorProviders?.[accountId] === undefined
        && viewerProviders?.[accountId] === undefined
      ) return false;
      return true;
    };

    return service.repo.updateUser({
      ...params,
      starProvider: {
        ...starProvider,
        enabled: hasAccess() && enabled,
      },
    });
  }

  return service.repo.updateUser(params);
};
