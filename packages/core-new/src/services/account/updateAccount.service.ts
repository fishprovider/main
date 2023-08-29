import {
  BaseError,
  getAccountService,
  type UpdateAccountService,
  UserError,
} from '../..';

export const updateAccountService: UpdateAccountService = async ({
  params, repositories, context,
}) => {
  if (!context?.userSession?._id) throw new BaseError(UserError.USER_ACCESS_DENIED);

  const { accountId } = params;
  await getAccountService({
    params: {
      accountId,
      projection: { _id: 1 },
    },
    repositories,
    context,
  });
  return repositories.account.updateAccount(params);
};
