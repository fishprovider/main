import {
  type Account,
  AccountError,
  AccountViewType,
  type GetAccountService,
  getRoleProvider,
  type IAccountService,
  type Projection,
  RepositoryError,
  ServiceError,
  validateProjection,
} from '../..';

export const getAccount = (
  service: IAccountService,
): GetAccountService => async (params, user) => {
  const { accountId } = params;
  if (!accountId) {
    throw new Error(ServiceError.BAD_REQUEST);
  }

  const projection: Projection<Account> = {
    ...params.projection,
    config: 0,
  };

  const account = await service.repo.getAccount({
    ...params,
    projection,
  });

  if (!account) {
    throw new Error(AccountError.ACCOUNT_NOT_FOUND);
  }

  if (!validateProjection(projection, account)) {
    throw new Error(RepositoryError.BAD_RESULT);
  }

  const { isManagerWeb } = getRoleProvider(user?.roles);

  const {
    providerViewType, userId, members, memberInvites, deleted,
  } = account;

  const checkAccess = () => {
    if (isManagerWeb) return true;
    if (deleted) return false;
    if (providerViewType === AccountViewType.public) return true;

    // for private accounts
    if (!user?._id) return false;
    if (userId === user._id) return true;
    if (members?.some((item) => item.userId === user._id)) return true;
    if (memberInvites?.some((item) => item.email === user.email)) return true;

    return false;
  };
  if (!checkAccess()) {
    throw new Error(AccountError.ACCOUNT_ACCESS_DENIED);
  }

  return account;
};
