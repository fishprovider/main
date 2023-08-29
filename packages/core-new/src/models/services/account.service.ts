import type {
  Account, AccountRepository, BaseService, BaseServiceParams,
  GetAccountParams, UpdateAccountParams, UserRepository,
} from '..';

export interface AccountServiceBaseParams extends BaseServiceParams {
  repositories: {
    account: AccountRepository
  },
}

//
// function params
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

export interface IAccountService extends BaseService {
  getAccount: GetAccountService;
  updateAccount: UpdateAccountService;
  joinAccount: JoinAccountService;
}
