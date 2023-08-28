import {
  type IAccountService,
  type UpdateAccountService,
} from '../..';

export const updateAccount = (
  service: IAccountService,
): UpdateAccountService => async (params) => {
  const { accountId } = params;
  await service.getAccount({
    accountId,
    projection: { _id: 1 },
  });

  return service.repo.updateAccount(params);
};
