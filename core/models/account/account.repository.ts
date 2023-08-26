import type { Projection } from '../repository';
import type { Account, AccountMember } from '.';

export interface GetAccountParams {
  accountId: string,
  memberId?: string,
  projection?: Projection<Account>,
}

export interface UpdateAccountParams {
  accountId: string,
  name?: string,
  returnDoc?: boolean,
}

export interface AddAccountMemberParams {
  accountId: string,
  member?: AccountMember,
  returnDoc?: boolean,
}

export interface AccountRepository {
  getAccount: (params: GetAccountParams) => Promise<Partial<Account> | null>;
  updateAccount: (params: UpdateAccountParams) => Promise<Partial<Account>>;
  addAccountMember: (params: AddAccountMemberParams) => Promise<Partial<Account>>;
}

export const accountRepositoryDefault: AccountRepository = {
  getAccount: async () => null,
  updateAccount: async () => ({}),
  addAccountMember: async () => ({}),
};
