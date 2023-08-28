import {
  AccountError,
  BaseError,
  type IAccountService,
  type JoinAccountService,
  ServiceError,
  ServiceName,
  UserError,
} from '../..';

export const joinAccount = (
  service: IAccountService,
): JoinAccountService => async (params, userSession) => {
  if (!userSession._id) throw new BaseError(UserError.USER_ACCESS_DENIED);

  if (!userSession.email || !userSession.name) {
    throw new BaseError(ServiceError.SERVICE_BAD_REQUEST);
  }

  const { accountId } = params;
  const account = await service.getAccount({
    accountId,
    projection: {
      _id: 1,
      memberInvites: 1,
    },
  });

  const { memberInvites } = account;
  const memberInvite = memberInvites?.find((item) => item.email === userSession.email);
  if (!memberInvite) {
    throw new BaseError(AccountError.ACCOUNT_ACCESS_DENIED);
  }

  const { email, role } = memberInvite;

  const userService = service.getService(ServiceName.user);

  await userService.updateUser({
    email,
    addRole: {
      accountId,
      role,
    },
  }, userSession);

  return service.updateAccount({
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
    removeMemberInvite: memberInvite,
  }, userSession);
};
