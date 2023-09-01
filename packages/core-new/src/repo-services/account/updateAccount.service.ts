import {
  BaseError,
  getAccountService,
  RepositoryError,
  sanitizeAccountBaseGetOptions,
  ServiceError,
  type UpdateAccountService,
  UserError,
  validateProjection,
} from '../..';

export const updateAccountService: UpdateAccountService = async ({
  filter, payload, options: optionsRaw, repositories, context,
}) => {
  //
  // pre-check
  //
  const { accountId } = filter;
  if (!accountId) throw new BaseError(ServiceError.SERVICE_BAD_REQUEST);
  if (!context?.userSession?._id) throw new BaseError(UserError.USER_ACCESS_DENIED);
  if (!repositories.account.updateAccount) throw new BaseError(RepositoryError.REPOSITORY_NOT_IMPLEMENT);

  await getAccountService({
    filter,
    options: {
      projection: { _id: 1 },
    },
    repositories,
    context,
  });

  //
  // main
  //
  const options = sanitizeAccountBaseGetOptions(optionsRaw);
  const { doc: account } = await repositories.account.updateAccount(filter, payload, options);

  if (account && !validateProjection(options.projection, account)) {
    throw new BaseError(RepositoryError.REPOSITORY_BAD_RESULT);
  }

  return { doc: account };
};
