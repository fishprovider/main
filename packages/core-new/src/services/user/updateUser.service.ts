import {
  BaseError,
  type IUserService,
  ServiceError,
  type UpdateUserService,
  UserError,
} from '../..';

export const updateUser = (
  _service: IUserService,
): UpdateUserService => async (
  repositories,
  params,
  userSession,
) => {
  const { userId, email, starProvider } = params;
  if (!(userId || email)) throw new BaseError(ServiceError.SERVICE_BAD_REQUEST);
  if (userId !== userSession._id) throw new BaseError(UserError.USER_ACCESS_DENIED);

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

    return repositories.user.updateUser({
      ...params,
      starProvider: {
        ...starProvider,
        enabled: hasAccess() && enabled,
      },
    });
  }

  return repositories.user.updateUser(params);
};
