import type {
  Account, AccountMember, BaseGetParams, BaseUpdateParams,
} from '..';

export interface AccountBaseGetParams extends BaseGetParams<Account> {
  accountId: string,
}

export interface AccountBaseUpdateParams extends BaseUpdateParams, AccountBaseGetParams {
}

//
// function params
//

export interface GetAccountParams extends AccountBaseGetParams {
  memberId?: string,
}

export interface UpdateAccountParams extends AccountBaseUpdateParams {
  name?: string,
  addMember?: AccountMember,
  removeMemberId?: string,
  removeMemberInviteEmail?: string,
}

export interface AccountRepository {
  getAccount: (params: GetAccountParams) => Promise<Partial<Account> | null>;
  updateAccount: (params: UpdateAccountParams) => Promise<Partial<Account>>;
}
