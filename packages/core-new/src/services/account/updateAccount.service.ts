import {
  AccountRepository,
  BaseError,
  type IAccountService,
  type UpdateAccountService,
  UserError,
} from '../..';

export const updateAccount = (
  service: IAccountService,
  getRepo: () => AccountRepository,
): UpdateAccountService => async (params, userSession) => {
  if (!userSession._id) throw new BaseError(UserError.USER_ACCESS_DENIED);

  const { accountId } = params;
  await service.getAccount({
    accountId,
    projection: { _id: 1 },
  });

  return getRepo().updateAccount(params);
};
