import {
  BaseError,
  type UpdateUserService,
  UserError,
} from '../..';

export const updateUserService: UpdateUserService = async ({
  params, repositories, context,
}) => {
  if (!context?.userSession?._id) throw new BaseError(UserError.USER_ACCESS_DENIED);
  const { userSession } = context;
  const { starProvider } = params;

  const userParams = {
    userId: userSession._id,
    email: userSession.email,
  };

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
      ...userParams,
      starProvider: {
        ...starProvider,
        enabled: hasAccess() && enabled,
      },
    });
  }

  return repositories.user.updateUser({
    ...params,
    ...userParams,
  });
};
