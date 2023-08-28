import type {
  Account, AccountRepository, BaseService, GetAccountParams, User,
} from '..';

export type GetAccountService = (
  params: GetAccountParams,
  user?: Partial<User>,
) => Promise<Partial<Account> | null>;

export interface IAccountService extends BaseService {
  repo: AccountRepository
  getAccount: GetAccountService;
}
