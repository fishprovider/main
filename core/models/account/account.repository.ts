import type { Projection } from '../repository';
import type {
  Account, AccountMember, AccountPlatform, AccountType,
} from '.';

export interface GetAccountParams {
  accountId?: string,
  accountType?: AccountType,
  accountPlatform?: AccountPlatform,
  projection?: Projection<Account>,
}

export interface UpdateAccountParams {
  accountId: string,
  name?: string,
  memberInviteEmail?: string,
  member?: AccountMember,
}

export interface AccountRepository {
  getAccount: (params: GetAccountParams) => Promise<Partial<Account> | null>;
  updateAccount: (params: UpdateAccountParams) => Promise<boolean>;
}
