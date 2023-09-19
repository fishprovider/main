import { AccountError, BaseError, UserError } from '@fishprovider/core';
import { RepositoryError } from '@fishprovider/repositories';

import {
  getAccountService, JoinAccountService, sanitizeAccountBaseGetOptions, ServiceError,
  updateAccountService, updateUserService, validateProjection,
} from '../..';

export const joinAccountService: JoinAccountService = async ({
  filter, options: optionsRaw, repositories, context,
}) => {
  //
  // pre-check
  //
  if (!context?.userSession?._id) throw new BaseError(UserError.USER_ACCESS_DENIED);
  const { userSession } = context;
  if (!userSession.email || !userSession.name) {
    throw new BaseError(ServiceError.SERVICE_BAD_REQUEST);
  }

  const { doc: accountMemberInvites } = await getAccountService({
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
  if (!accountMemberInvites) {
    throw new BaseError(AccountError.ACCOUNT_NOT_FOUND);
  }

  const { memberInvites } = accountMemberInvites;
  const memberInvite = memberInvites?.find((item) => item.email === userSession.email);
  if (!memberInvite) {
    throw new BaseError(AccountError.ACCOUNT_ACCESS_DENIED);
  }

  //
  // main
  //
  const { accountId } = filter;
  const { email, role } = memberInvite;
  await updateUserService({
    filter: {
      email,
    },
    payload: {
      addRole: {
        accountId,
        role,
      },
    },
    options: {},
    repositories,
    context,
  });

  const options = sanitizeAccountBaseGetOptions(optionsRaw);
  const { doc: account } = await updateAccountService({
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
    options,
    repositories,
    context,
  });

  if (!validateProjection(options?.projection, account)) {
    throw new BaseError(RepositoryError.REPOSITORY_INVALID_PROJECTION);
  }

  return { doc: account };
};
