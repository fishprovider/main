import type { Account } from '@fishprovider/enterprise-rules';

import type { AccountRepository, GetAccountRepositoryParams } from './_account.repository';

export interface GetAccountUseCaseParams extends GetAccountRepositoryParams {
  isInternal?: boolean;
}

export type GetAccountUseCase = (params: GetAccountUseCaseParams) => Promise<Account | undefined>;

export const getAccountUseCase = (
  AccountRepository: AccountRepository,
): GetAccountUseCase => async (
  params: GetAccountUseCaseParams,
) => {
  const account = await AccountRepository.getAccount(params);

  // if (!account) {
  //   throw new Error(AccountError.ACCOUNT_NOT_FOUND);
  // }

  // const {
  //   _id: providerId,
  //   providerViewType,
  //   userId, members, memberInvites,
  //   deleted,
  // } = account;

  // const { isManagerWeb } = getRoleProvider(userSession.roles);

  // const checkAccess = () => {
  //   if (isManagerWeb) return true;
  //   if (deleted) return false;
  //   if (providerViewType === ProviderViewType.public) return true;
  //   if (userSession._id) {
  //     if (userId === userSession._id) return true;
  //     if (members?.some((item) => item.userId === userSession._id)) return true;
  //     if (memberInvites?.some((item) => item.email === userSession.email)) return true;
  //   }
  //   return false;
  // };
  // if (!checkAccess()) {
  //   return { error: AccountError.ACCOUNT_ACCESS_DENIED };
  // }

  return account;
};
