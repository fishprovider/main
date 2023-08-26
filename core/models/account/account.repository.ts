import type { Projection } from '../repository';
import type {
  Account, AccountMember, AccountPlatform, AccountType,
} from '.';

export interface GetAccount {
  accountId?: string,
  accountType?: AccountType,
  accountPlatform?: AccountPlatform,
  projection?: Projection<Account>,
}

export interface UpdateAccount {
  accountId: string,
  name?: string,
  memberInviteEmail?: string,
  member?: AccountMember,
}

export interface AccountRepository {
  getAccount: (params: GetAccount) => Promise<Partial<Account> | null>;
  updateAccount: (params: UpdateAccount) => Promise<boolean>;
}
