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
): JoinAccountService => async (params, user) => {
  if (!user._id || !user.email || !user.name) {
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
  const memberInvite = memberInvites?.find((item) => item.email === user.email);
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
  });

  return service.updateAccount({
    accountId,
    addMember: {
      userId: user._id,
      email,
      role,
      name: user.name,

      picture: user.picture,

      updatedAt: new Date(),
      createdAt: new Date(),
    },
    removeMemberInvite: memberInvite,
  }, user);
};
