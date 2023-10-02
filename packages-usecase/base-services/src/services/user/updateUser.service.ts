import {
  checkLogin, checkProjection, checkRepository, sanitizeGetUserFilter,
  sanitizeUserBaseGetOptions, UpdateUserService,
} from '../..';

export const updateUserService: UpdateUserService = async ({
  filter: filterRaw, payload: payloadRaw, options: optionsRaw, repositories, context,
}) => {
  //
  // pre-check
  //
  const userSession = checkLogin(context?.userSession);
  const updateUserRepo = checkRepository(repositories.user.updateUser);

  //
  // main
  //
  const payload = { ...payloadRaw };
  const { starAccount } = payload;

  if (starAccount) {
    const { roles } = userSession;
    const { accountId, enabled } = starAccount;

    const hasAccess = () => {
      if (!roles) return false;
      const {
        adminProviders, traderProviders, protectorProviders, viewerProviders,
        adminAccounts, traderAccounts, protectorAccounts, viewerAccounts,
      } = roles;
      if (!adminProviders?.[accountId]
        && !traderProviders?.[accountId]
        && !protectorProviders?.[accountId]
        && !viewerProviders?.[accountId]
        && !adminAccounts?.[accountId]
        && !traderAccounts?.[accountId]
        && !protectorAccounts?.[accountId]
        && !viewerAccounts?.[accountId]
      ) return false;
      return true;
    };

    payload.starAccount = {
      ...starAccount,
      enabled: hasAccess() && enabled,
    };
  }

  const filter = sanitizeGetUserFilter(filterRaw, userSession);
  const options = sanitizeUserBaseGetOptions(optionsRaw);

  const { doc: user } = await updateUserRepo(
    filter,
    payload,
    options,
  );

  checkProjection(options?.projection, user);

  return { doc: user };
};
