import { BaseError, UserError } from '@fishprovider/core';
import { RepositoryError } from '@fishprovider/repositories';

import {
  sanitizeGetUserFilter, sanitizeUserBaseGetOptions, UpdateUserService, validateProjection,
} from '../..';

export const updateUserService: UpdateUserService = async ({
  filter: filterRaw, payload: payloadRaw, options: optionsRaw, repositories, context,
}) => {
  //
  // pre-check
  //
  if (!context?.userSession?._id) throw new BaseError(UserError.USER_ACCESS_DENIED);
  if (!repositories.user.updateUser) throw new BaseError(RepositoryError.REPOSITORY_NOT_IMPLEMENT);

  //
  // main
  //
  const { userSession } = context;

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

  const filter = sanitizeGetUserFilter(filterRaw, userSession);
  const options = sanitizeUserBaseGetOptions(optionsRaw);

  const { doc: user } = await repositories.user.updateUser(
    filter,
    payload,
    options,
  );

  if (user && !validateProjection(options.projection, user)) {
    throw new BaseError(RepositoryError.REPOSITORY_BAD_RESULT, 'projection', user._id);
  }

  return { doc: user };
};
