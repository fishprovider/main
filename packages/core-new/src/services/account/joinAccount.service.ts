import {
  AccountError,
  BaseError,
  type IAccountService,
  type JoinAccountService,
  ServiceError,
  ServiceName,
} from '../..';

export const joinAccount = (
  service: IAccountService,
): JoinAccountService => async (
  repositories,
  params,
  userSession,
) => {
  if (!userSession.email || !userSession.name) {
    throw new BaseError(ServiceError.SERVICE_BAD_REQUEST);
  }

  const { accountId } = params;
  const account = await service.getAccount(
    repositories,
    {
      accountId,
      projection: {
        _id: 1,
        memberInvites: 1,
      },
    },
    userSession,
  );

  const { memberInvites } = account;
  const memberInvite = memberInvites?.find((item) => item.email === userSession.email);
  if (!memberInvite) {
    throw new BaseError(AccountError.ACCOUNT_ACCESS_DENIED);
  }

  const { email, role } = memberInvite;

  const userService = service.getService(ServiceName.user);

  await userService.updateUser(
    repositories,
    {
      email,
      addRole: {
        accountId,
        role,
      },
    },
    userSession,
  );

  return service.updateAccount(
    repositories,
    {
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
    userSession,
  );
};
