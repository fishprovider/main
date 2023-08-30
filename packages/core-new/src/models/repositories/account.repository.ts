import type {
  Account, AccountMember, BaseGetManyResult, BaseGetOptions,
  BaseGetResult, BaseUpdateOptions, BaseUpdateResult,
} from '..';

export interface GetAccountFilter {
  accountId?: string,
  accountIds?: string[],
  memberId?: string,
}

export interface UpdateAccountPayload {
  name?: string,
  addMember?: AccountMember,
  removeMemberId?: string,
  removeMemberInviteEmail?: string,
}

export interface AccountRepository {
  getAccount: (
    filter: GetAccountFilter,
    options: BaseGetOptions<Account>,
  ) => Promise<BaseGetResult<Account>>;

  getAccounts: (
    filter: GetAccountFilter,
    options: BaseGetOptions<Account>,
  ) => Promise<BaseGetManyResult<Account>>;

  updateAccount: (
    filter: GetAccountFilter,
    payload: UpdateAccountPayload,
    options: BaseUpdateOptions<Account>,
  ) => Promise<BaseUpdateResult<Account>>;
}
