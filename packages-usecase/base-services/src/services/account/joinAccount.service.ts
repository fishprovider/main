import { AccountError, BaseError } from '@fishprovider/core';

import {
  checkLogin, checkProjection, getAccountService, JoinAccountService,
  sanitizeAccountBaseGetOptions, updateAccountService, updateUserService,
} from '../..';

export const joinAccountService: JoinAccountService = async ({
  filter, options: optionsRaw, repositories, context,
}) => {
  //
  // pre-check
  //
  const userSession = checkLogin(context?.userSession);

  const { doc: account } = await getAccountService({
    filter,
    options: {
      projection: {
        _id: 1,
        memberInvites: 1,
      },
    },
    repositories,
    context,
  });

  const memberInvite = account?.memberInvites?.find((item) => item.email === userSession.email);
  if (!memberInvite) {
    throw new BaseError(AccountError.ACCOUNT_ACCESS_DENIED);
  }

  //
  // main
  //
  const { accountId } = filter;
  const { email, role } = memberInvite;

  const options = sanitizeAccountBaseGetOptions(optionsRaw);
  const { doc: accountNew } = await updateAccountService({
    filter: {
      accountId,
    },
    payload: {
      addMember: {
        userId: userSession._id,
        email,
        role,
        name: userSession.name,
        picture: userSession.picture,
        updatedAt: new Date(),
        createdAt: new Date(),
      },
      removeMemberInviteEmail: memberInvite.email,
    },
    options: {
      returnAfter: true,
      projection: {
        _id: 1,
        members: 1,
        memberInvites: 1,
      },
    },
    repositories,
    context: {
      ...context,
      internal: true,
    },
  });

  checkProjection(options?.projection, accountNew);

  // non-blocking
  updateUserService({
    filter: {
      email,
    },
    payload: {
      addRole: {
        accountId,
        role,
      },
    },
    repositories,
    context,
  });

  return { doc: accountNew };
};
