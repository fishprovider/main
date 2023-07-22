import type {
  Account, AccountConfig, AccountPlatform, AccountType,
} from '@fishprovider/enterprise-rules';

import type { Projection } from '~types/repository';

export interface GetAccountRepositoryParams {
  accountId: string,
  projection?: Projection<Account>,
}

export interface GetAccountExternalRepositoryParams {
  accountId: string,
  accountType: AccountType,
  accountPlatform: AccountPlatform,
  handler: (config?: AccountConfig) => Promise<Partial<Account>>,
}

export interface UpdateAccountRepositoryParams {
  accountId?: string,
  payload?: Record<string, any>,
  payloadDelete?: Record<string, any>,
  payloadPush?: Record<string, any>,
  payloadPull?: Record<string, any>,
}

export interface AccountRepository {
  getAccount: (params: GetAccountRepositoryParams) => Promise<Account | undefined>;
  getAccountExternal: (params: GetAccountExternalRepositoryParams) => Promise<Partial<Account>>;
  updateAccount: (params: UpdateAccountRepositoryParams) => Promise<boolean>;
}
