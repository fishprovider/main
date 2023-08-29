import type {
  Account, AccountRepository, BaseServiceParams,
  GetAccountParams, UpdateAccountParams, UserRepository,
} from '..';

export interface AccountServiceBaseParams extends BaseServiceParams {
  repositories: {
    account: AccountRepository
  },
}

//
// services
//

export type GetAccountService = (params: AccountServiceBaseParams & {
  params: GetAccountParams,
}) => Promise<Partial<Account>>;

export type UpdateAccountService = (params: AccountServiceBaseParams & {
  params: UpdateAccountParams,
}) => Promise<Partial<Account>>;

export type JoinAccountService = (params: AccountServiceBaseParams & {
  params: UpdateAccountParams,
  repositories: {
    account: AccountRepository
    user: UserRepository,
  },
}) => Promise<Partial<Account>>;
