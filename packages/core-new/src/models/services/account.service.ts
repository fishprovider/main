import type {
  Account, AccountRepository, BaseService, GetAccountParams,
  UpdateAccountParams, User,
} from '..';

export type GetAccountService = (
  params: GetAccountParams,
  user?: Partial<User>,
) => Promise<Partial<Account>>;

export type UpdateAccountService = (
  params: UpdateAccountParams,
  user: Partial<User>,
) => Promise<Partial<Account>>;

export type JoinAccountService = (
  params: UpdateAccountParams,
  user: Partial<User>,
) => Promise<Partial<Account>>;

export interface IAccountService extends BaseService {
  repo: AccountRepository
  getAccount: GetAccountService;
  updateAccount: UpdateAccountService;
  joinAccount: JoinAccountService;
}
