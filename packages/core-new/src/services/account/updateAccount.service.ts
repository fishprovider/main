import {
  type IAccountService,
  type UpdateAccountService,
} from '../..';

export const updateAccount = (
  service: IAccountService,
): UpdateAccountService => async (
  repositories,
  params,
  userSession,
) => {
  const { accountId } = params;
  await service.getAccount(
    repositories,
    {
      accountId,
      projection: { _id: 1 },
    },
    userSession,
  );

  return repositories.account.updateAccount(params);
};
