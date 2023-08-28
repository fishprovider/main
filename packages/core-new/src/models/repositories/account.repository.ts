import type {
  Account, AccountMember, AccountMemberInvite, BaseGetParams, BaseUpdateParams,
} from '..';

export interface AccountBaseGetParams extends BaseGetParams<Account> {
  accountId: string,
}

export interface AccountBaseUpdateParams extends BaseUpdateParams, AccountBaseGetParams {
}

export interface GetAccountParams extends AccountBaseGetParams {
  memberId?: string,
}

export interface UpdateAccountParams extends AccountBaseUpdateParams {
  name?: string,
  addMember?: AccountMember,
  removeMember?: AccountMember,
  removeMemberInvite?: AccountMemberInvite,
}

export interface AccountRepository {
  getAccount: (params: GetAccountParams) => Promise<Partial<Account> | null>;
  updateAccount: (params: UpdateAccountParams) => Promise<Partial<Account>>;
}
