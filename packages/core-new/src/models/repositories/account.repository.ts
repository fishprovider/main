import type {
  Account, AccountMember, AccountMemberInvite, Projection,
} from '..';

export interface GetAccountParams {
  accountId: string,
  memberId?: string,
  projection?: Projection<Account>,
}

export interface UpdateAccountParams {
  accountId: string,
  name?: string,
  addMember?: AccountMember,
  removeMemberInvite?: AccountMemberInvite,
  returnDoc?: boolean,
}

export interface AccountRepository {
  getAccount: (params: GetAccountParams) => Promise<Partial<Account> | null>;
  updateAccount: (params: UpdateAccountParams) => Promise<Partial<Account>>;
}

export const accountRepoDefault: AccountRepository = {
  getAccount: async () => null,
  updateAccount: async () => ({}),
};
