import {
  BaseError,
  type IUserService,
  ServiceError,
  type UpdateUserService,
  UserError,
  type UserRepository,
} from '../..';

export const updateUser = (
  _service: IUserService,
  getRepo: () => UserRepository,
): UpdateUserService => async (params, userSession) => {
  if (!userSession._id) throw new BaseError(UserError.USER_ACCESS_DENIED);

  const { userId, email, starProvider } = params;
  if (!(userId || email)) throw new BaseError(ServiceError.SERVICE_BAD_REQUEST);

  if (starProvider) {
    const { roles } = userSession;
    const hasAccess = () => {
      if (!roles) return false;
      if (roles.adminProviders?.[starProvider.accountId] === undefined
        && roles.traderProviders?.[starProvider.accountId] === undefined
        && roles.protectorProviders?.[starProvider.accountId] === undefined
        && roles.viewerProviders?.[starProvider.accountId] === undefined
      ) return false;
      return true;
    };

    return getRepo().updateUser({
      ...params,
      starProvider: {
        ...starProvider,
        enabled: hasAccess() && starProvider.enabled,
      },
    });
  }

  return getRepo().updateUser(params);
};
