import {
  AccountError,
  AccountViewType,
  BaseError,
  type GetAccountService,
  getProjectionBlacklist,
  getRoleProvider,
  type IAccountService,
  RepositoryError,
  validateProjection,
} from '../..';

export const getAccount = (
  service: IAccountService,
): GetAccountService => async (params, userSession) => {
  const projection = getProjectionBlacklist({
    config: 0,
  }, params.projection);

  const account = await service.repo.getAccount({
    ...params,
    projection,
  });

  if (!account) {
    throw new BaseError(AccountError.ACCOUNT_NOT_FOUND);
  }

  if (!validateProjection(projection, account)) {
    throw new BaseError(RepositoryError.REPOSITORY_BAD_RESULT);
  }

  const { isManagerWeb } = getRoleProvider(userSession?.roles);

  const {
    providerViewType, userId, members, memberInvites, deleted,
  } = account;

  const hasAccess = () => {
    if (isManagerWeb) return true;
    if (deleted) return false;
    if (providerViewType === AccountViewType.public) return true;

    // for private accounts
    if (!userSession?._id) return false;
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
