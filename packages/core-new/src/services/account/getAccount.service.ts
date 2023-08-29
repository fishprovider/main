import {
  AccountError,
  AccountViewType,
  BaseError,
  type GetAccountService,
  getProjectionBlacklist,
  getRoleProvider,
  RepositoryError,
  validateProjection,
} from '../..';

export const getAccount: GetAccountService = async ({
  params, repositories, context,
}) => {
  const projection = getProjectionBlacklist({
    config: 0,
  }, params.projection);

  const account = await repositories.account.getAccount({
    ...params,
    projection,
  });

  if (!account) {
    throw new BaseError(AccountError.ACCOUNT_NOT_FOUND);
  }

  if (!validateProjection(projection, account)) {
    throw new BaseError(RepositoryError.REPOSITORY_BAD_RESULT);
  }

  const { isManagerWeb } = getRoleProvider(context?.userSession?.roles);

  const {
    providerViewType, userId, members, memberInvites, deleted,
  } = account;

  const hasAccess = () => {
    if (isManagerWeb) return true;
    if (deleted) return false;
    if (providerViewType === AccountViewType.public) return true;

    // for private accounts
    if (!context?.userSession?._id) return false;
    const { userSession } = context;
    if (userId === userSession._id) return true;
    if (members?.some((item) => item.userId === userSession._id)) return true;
    if (memberInvites?.some((item) => item.email === userSession.email)) return true;

    return false;
  };
  if (!hasAccess()) {
    throw new BaseError(AccountError.ACCOUNT_ACCESS_DENIED);
  }

  return account;
};
