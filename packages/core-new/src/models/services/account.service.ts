import type {
  Account, AccountRepository, BaseService, GetAccountParams,
  UpdateAccountParams, UserRepository, UserSession,
} from '..';

export type GetAccountService = (
  repositories: {
    account: AccountRepository
  },
  params: GetAccountParams,
  userSession?: UserSession,
) => Promise<Partial<Account>>;

export type UpdateAccountService = (
  repositories: {
    account: AccountRepository
  },
  params: UpdateAccountParams,
  userSession: UserSession,
) => Promise<Partial<Account>>;

export type JoinAccountService = (
  repositories: {
    account: AccountRepository
    user: UserRepository,
  },
  params: UpdateAccountParams,
  userSession: UserSession,
) => Promise<Partial<Account>>;

export interface IAccountService extends BaseService {
  getAccount: GetAccountService;
  updateAccount: UpdateAccountService;
  joinAccount: JoinAccountService;
}
