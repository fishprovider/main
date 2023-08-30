import {
  AccountError,
  BaseError,
  getAccountService,
  type JoinAccountService,
  ServiceError,
  updateAccountService,
  updateUserService,
  UserError,
} from '../..';

export const joinAccountService: JoinAccountService = async ({
  filter, repositories, context,
}) => {
  //
  // pre-check
  //
  if (!context?.userSession?._id) throw new BaseError(UserError.USER_ACCESS_DENIED);
  const { userSession } = context;
  if (!userSession.email || !userSession.name) {
    throw new BaseError(ServiceError.SERVICE_BAD_REQUEST);
  }
  const { accountId } = filter;
  if (!accountId) throw new BaseError(ServiceError.SERVICE_BAD_REQUEST);
  // check account access
  const { doc: account } = await getAccountService({
    filter: {
      ...filter,
      projection: {
        _id: 1,
        memberInvites: 1,
      },
    },
    repositories,
    context,
  });
  if (!account) {
    throw new BaseError(AccountError.ACCOUNT_NOT_FOUND);
  }

  const { memberInvites } = account;
  const memberInvite = memberInvites?.find((item) => item.email === userSession.email);
  if (!memberInvite) {
    throw new BaseError(AccountError.ACCOUNT_ACCESS_DENIED);
  }

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
    repositories,
    context,
  });

  return updateAccountService({
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
    repositories,
    context,
  });
};
