import {
  BaseError,
  getAccountService,
  ServiceError,
  type UpdateAccountService,
  UserError,
} from '../..';

export const updateAccountService: UpdateAccountService = async ({
  filter, payload, repositories, context,
}) => {
  //
  // pre-check
  //
  const { accountId } = filter;
  if (!accountId) throw new BaseError(ServiceError.SERVICE_BAD_REQUEST);
  if (!context?.userSession?._id) throw new BaseError(UserError.USER_ACCESS_DENIED);
  // check account access
  await getAccountService({
    filter: {
      ...filter,
      projection: { _id: 1 },
    },
    repositories,
    context,
  });

  //
  // main
  //
  return repositories.account.updateAccount(filter, payload);
};
