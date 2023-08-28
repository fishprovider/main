import type { Account, Projection } from '..';

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

export interface JoinAccountParams {
  accountId: string,
  email: string,
  returnDoc?: boolean,
}

export interface AccountRepository {
  getAccount: (params: GetAccountParams) => Promise<Partial<Account> | null>;
  updateAccount: (params: UpdateAccountParams) => Promise<Partial<Account>>;
  joinAccount: (params: JoinAccountParams) => Promise<Partial<Account>>;
}

export const accountRepoDefault: AccountRepository = {
  getAccount: async () => null,
  updateAccount: async () => ({}),
  joinAccount: async () => ({}),
};
