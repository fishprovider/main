import {
  BaseError,
  type UpdateUserService,
  UserError,
} from '../..';

export const updateUserService: UpdateUserService = async ({
  filter: filterRaw, payload: payloadRaw, repositories, context,
}) => {
  //
  // pre-check
  //
  if (!context?.userSession?._id) throw new BaseError(UserError.USER_ACCESS_DENIED);

  //
  // main
  //
  const { userSession } = context;
  const filter = {
    filterRaw,
    userId: userSession._id,
    email: userSession.email,
  };

  let payload = {
    ...payloadRaw,
  };
  const { starProvider } = payload;

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

    payload = {
      ...payload,
      starProvider: {
        ...starProvider,
        enabled: hasAccess() && enabled,
      },
    };
  }

  return repositories.user.updateUser(filter, payload);
};
