import type {
  Account, AccountMember, BaseGetManyResult, BaseGetOptions, BaseGetResult,
  BaseUpdateOptions, BaseUpdateResult,
} from '..';

export interface GetAccountFilter extends BaseGetOptions<Account> {
  accountId?: string,
  accountIds?: string[],
  memberId?: string,
}

export interface UpdateAccountPayload extends BaseUpdateOptions {
  name?: string,
  addMember?: AccountMember,
  removeMemberId?: string,
  removeMemberInviteEmail?: string,
}

export interface AccountRepository {
  getAccount: (
    filter: GetAccountFilter
  ) => Promise<BaseGetResult<Account>>;

  getAccounts: (
    filter: GetAccountFilter
  ) => Promise<BaseGetManyResult<Account>>;

  updateAccount: (
    filter: GetAccountFilter,
    payload: UpdateAccountPayload
  ) => Promise<BaseUpdateResult<Account>>;
}
