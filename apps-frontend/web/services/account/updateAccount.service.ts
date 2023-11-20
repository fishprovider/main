import {
  AccountActivity, AccountBannerStatus, AccountProtectSettings, AccountSettings,
  AccountTradeSettings, AccountViewType, checkRepository,
} from '@fishprovider/core';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import { StoreFirstAccountRepository } from '@fishprovider/store-first';
import { Account } from '@fishprovider/utils/types/Account.model';

export const updateAccountService = async (
  filter: {
    accountId: string,
  },
  payload: {
    accountViewType?: AccountViewType,
    name?: string,
    icon?: string,
    strategyId?: string,
    notes?: string,
    privateNotes?: string,
    bannerStatus?: AccountBannerStatus,
    tradeSettings?: AccountTradeSettings;
    protectSettings?: AccountProtectSettings;
    settings?: AccountSettings;
    addActivity?: AccountActivity,
  },
) => {
  const updateAccountRepo = checkRepository(StoreFirstAccountRepository.updateAccount);
  const { doc: account } = await updateAccountRepo(filter, payload);

  if (account) {
    // TODO: migrate to StoreFirstAccountRepository
    storeAccounts.mergeDoc(account as Partial<Account>);
  }
};
