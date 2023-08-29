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
  params, repositories, context,
}) => {
  if (!context?.userSession?._id) throw new BaseError(UserError.USER_ACCESS_DENIED);
  const { userSession } = context;

  if (!userSession.email || !userSession.name) {
    throw new BaseError(ServiceError.SERVICE_BAD_REQUEST);
  }

  const { accountId } = params;
  const account = await getAccountService({
    params: {
      accountId,
      projection: {
        _id: 1,
        memberInvites: 1,
      },
    },
    repositories,
    context,
  });

  const { memberInvites } = account;
  const memberInvite = memberInvites?.find((item) => item.email === userSession.email);
  if (!memberInvite) {
    throw new BaseError(AccountError.ACCOUNT_ACCESS_DENIED);
  }

  const { email, role } = memberInvite;

  await updateUserService({
    params: {
      email,
      addRole: {
        accountId,
        role,
      },
    },
    repositories,
    context,
  });

  return updateAccountService({
    params: {
      accountId,
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
