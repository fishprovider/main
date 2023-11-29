import { ClientOnlyAccountRepository } from '@fishprovider/client-only';
import {
  Account, AccountActivity, AccountBannerStatus, AccountConfig, AccountPlatform,
  AccountProtectSettings, AccountSettings, AccountTradeSettings, AccountTradeType,
  AccountViewType, ProviderType,
} from '@fishprovider/core';
import {
  addAccountService, getAccountService, getAccountsService,
  removeAccountService, updateAccountService, watchAccountService,
} from '@fishprovider/core-frontend';
import { StoreFirstAccountRepository } from '@fishprovider/store-first';

export const getAccountController = async (filter: {
  accountId: string,
  getTradeAccount?: boolean,
}) => {
  const { doc: account } = await getAccountService({
    filter,
    repositories: { account: StoreFirstAccountRepository },
  });
  return account;
};

export const getAccountsController = async (filter: {
  viewType?: AccountViewType,
  email?: string,
}) => {
  const { docs: accounts } = await getAccountsService({
    filter,
    repositories: { account: StoreFirstAccountRepository },
  });
  return accounts;
};

export const updateAccountController = async (
  filter: {
    accountId: string,
  },
  payload: {
    viewType?: AccountViewType,
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
    account?: Partial<Account>,
  },
) => {
  const { doc: account } = await updateAccountService({
    filter,
    payload,
    repositories: {
      account: StoreFirstAccountRepository,
      clientOnly: ClientOnlyAccountRepository,
    },
  });
  return account;
};

export const addAccountController = async (
  payload: {
    name: string,
    providerType: ProviderType,
    platform: AccountPlatform,
    tradeType: AccountTradeType,
    baseConfig: Partial<AccountConfig>,
  },
) => {
  const { doc: account } = await addAccountService({
    payload,
    repositories: { account: StoreFirstAccountRepository },
  });
  return account;
};

export const removeAccountController = async (filter: {
  accountId: string,
}) => {
  const { doc: account } = await removeAccountService({
    filter,
    repositories: { account: StoreFirstAccountRepository },
  });
  return account;
};

export const watchAccountController = <T>(
  selector: (state: Record<string, Account>) => T,
) => watchAccountService({
    selector,
    repositories: { account: StoreFirstAccountRepository },
  });
