import {
  Account, AccountConfig, AccountMember, AccountViewType,
} from '@fishprovider/core';

import {
  BaseGetManyResult, BaseGetOptions, BaseGetResult, BaseUpdateOptions, BaseUpdateResult,
} from '..';

export interface AccountRepository {
  getAccount?: (
    filter: {
      accountId: string,
      config?: AccountConfig,
    },
    options?: BaseGetOptions<Account>,
  ) => Promise<BaseGetResult<Account>>;

  updateAccount?: (
    filter: {
      accountId: string,
    },
    payload: {
      name?: string,
      addMember?: AccountMember,
      removeMemberId?: string,
      removeMemberInviteEmail?: string,
      providerPlatformAccountId?: string,
      leverage?: number,
      balance?: number,
      assetId?: string,
      providerData?: any,
      updatedAt?: Date,
    },
    options?: BaseUpdateOptions<Account>,
  ) => Promise<BaseUpdateResult<Account>>;

  getAccounts?: (
    filter: {
      accountIds?: string[],
      accountViewType?: AccountViewType,
      memberId?: string,
      email?: string,
    },
    options?: BaseGetOptions<Account>,
  ) => Promise<BaseGetManyResult<Account>>;
}
