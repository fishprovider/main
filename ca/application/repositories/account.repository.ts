import {
  Account, AccountConfig, AccountPlatform, AccountType,
  Projection, RepositoryError,
} from '@fishprovider/core-new';

export interface GetAccountRepositoryParams {
  accountId?: string,
  query?: Record<string, any>,
  projection?: Projection<Account>,
}

export interface GetAccountExternalRepositoryParams {
  accountId: string,
  accountType: AccountType,
  accountPlatform: AccountPlatform,
  handler: (config?: AccountConfig) => Promise<Partial<Account>>,
}

export interface UpdateAccountRepositoryParams {
  accountId: string,
  payload?: Record<string, any>,
  payloadDelete?: Record<string, any>,
  payloadPush?: Record<string, any>,
  payloadPull?: Record<string, any>,
}

export interface AccountRepository {
  getAccount: (
    params: GetAccountRepositoryParams) => Promise<Partial<Account> | null>;
  getAccountExternal: (
    params: GetAccountExternalRepositoryParams) => Promise<Partial<Account> | null>;
  updateAccount: (
    params: UpdateAccountRepositoryParams) => Promise<boolean>;
}

export const DefaultAccountRepository: AccountRepository = {
  getAccount: () => {
    throw new Error(RepositoryError.REPOSITORY_BAD_RESULT);
  },
  getAccountExternal: () => {
    throw new Error(RepositoryError.REPOSITORY_BAD_RESULT);
  },
  updateAccount: () => {
    throw new Error(RepositoryError.REPOSITORY_BAD_RESULT);
  },
};
