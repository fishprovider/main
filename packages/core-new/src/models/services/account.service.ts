import type {
  Account, AccountRepository, BaseService, GetAccountParams,
  UpdateAccountParams, UserSession,
} from '..';

export type GetAccountService = (
  params: GetAccountParams,
  userSession?: UserSession,
) => Promise<Partial<Account>>;

export type UpdateAccountService = (
  params: UpdateAccountParams,
  userSession: UserSession,
) => Promise<Partial<Account>>;

export type JoinAccountService = (
  params: UpdateAccountParams,
  userSession: UserSession,
) => Promise<Partial<Account>>;

export interface IAccountService extends BaseService {
  repo: AccountRepository
  getAccount: GetAccountService;
  updateAccount: UpdateAccountService;
  joinAccount: JoinAccountService;
}
