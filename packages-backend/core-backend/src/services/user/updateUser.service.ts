import { checkRepository } from '@fishprovider/core';

import {
  checkLogin, checkProjection, UpdateUserService,
} from '../..';

export const updateUserService: UpdateUserService = async ({
  payload: payloadRaw, options, repositories, context,
}) => {
  //
  // pre-check
  //
  const userSession = checkLogin(context?.userSession);
  const updateUserRepo = checkRepository(repositories.user.updateUser);

  //
  // main
  //
  const { _id: userId, roles } = userSession;
  const payload = { ...payloadRaw };
  const { starAccount } = payload;

  if (starAccount) {
    const { accountId, enabled } = starAccount;

    const hasAccess = () => {
      if (!roles) return false;
      const {
        adminAccounts, traderAccounts, protectorAccounts, viewerAccounts,
      } = roles;
      if (!adminAccounts?.[accountId]
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

  const { doc: user } = await updateUserRepo(
    {
      email: userSession.email,
    },
    payload,
    options,
  );

  checkProjection(options?.projection, user);

  return {
    doc: {
      ...user,
      _id: userId,
    },
  };
};
