import {
  type Account,
  AccountError,
  AccountViewType,
  BaseError,
  type GetAccountService,
  getRoleProvider,
  type IAccountService,
  type Projection,
  RepositoryError,
  validateProjection,
} from '../..';

export const getAccount = (
  service: IAccountService,
): GetAccountService => async (params, userSession) => {
  const projection: Projection<Account> = {
    ...params.projection,
    config: 0,
  };

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

  const checkAccess = () => {
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
  if (!checkAccess()) {
    throw new BaseError(AccountError.ACCOUNT_ACCESS_DENIED);
  }

  return account;
};
