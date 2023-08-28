import {
  type Account, AccountError, AccountViewType, getRoleProvider,
  type User,
} from '@fishprovider/core-new';

import type { AccountRepository, GetAccountRepositoryParams } from '~repositories';

export interface GetAccountUseCaseParams extends GetAccountRepositoryParams {
  user?: Partial<User>;
}

export class GetAccountUseCase {
  accountRepository: AccountRepository;

  constructor(
    accountRepository: AccountRepository,
  ) {
    this.accountRepository = accountRepository;
  }

  async run(
    params: GetAccountUseCaseParams,
  ): Promise<Partial<Account>> {
    const account = await this.accountRepository.getAccount(params);
    if (!account) {
      throw new Error(AccountError.ACCOUNT_NOT_FOUND);
    }

    const { user } = params;
    const { isManagerWeb } = getRoleProvider(user?.roles);

    const {
      providerViewType,
      userId, members, memberInvites,
      deleted,
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

    // never leak the secret to outside
    delete account.config;

    return account;
  }
}
