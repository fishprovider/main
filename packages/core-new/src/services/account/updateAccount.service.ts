import {
  AccountRepository,
  type IAccountService,
  type UpdateAccountService,
} from '../..';

export const updateAccount = (
  service: IAccountService,
  getRepo: () => AccountRepository,
): UpdateAccountService => async (params) => {
  const { accountId } = params;
  await service.getAccount({
    accountId,
    projection: { _id: 1 },
  });

  return getRepo().updateAccount(params);
};
