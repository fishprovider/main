import {
  BaseError,
  type UpdateUserService,
  UserError,
} from '../..';

export const updateUser: UpdateUserService = async ({
  params, repositories, context,
}) => {
  if (!context?.userSession?._id) throw new BaseError(UserError.USER_ACCESS_DENIED);
  const { userSession } = context;
  const { starProvider } = params;

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
