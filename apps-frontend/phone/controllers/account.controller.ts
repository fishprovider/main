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

const defaultRepo = StoreFirstAccountRepository;

export const getAccountController = async (filter: {
  accountId: string,
  getTradeAccount?: boolean,
}) => {
  const { doc: account } = await getAccountService({
    filter,
    repositories: { account: defaultRepo },
  });
  return account;
};

export const getAccountsController = async (filter: {
  viewType?: AccountViewType,
  email?: string,
}) => {
  const { docs: accounts } = await getAccountsService({
    filter,
    repositories: { account: defaultRepo },
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
  const { account: accountUpdate, ...rest } = payload;
  if (accountUpdate) {
    const { doc: account } = await updateAccountService({
      filter,
      payload: { account: accountUpdate },
      repositories: { account: ClientOnlyAccountRepository },
    });
    return account;
  }

  const { doc: account } = await updateAccountService({
    filter,
    payload: rest,
    repositories: { account: defaultRepo },
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
    repositories: { account: defaultRepo },
  });
  return account;
};

export const removeAccountController = async (filter: {
  accountId: string,
}) => {
  const { doc: account } = await removeAccountService({
    filter,
    repositories: { account: defaultRepo },
  });
  return account;
};

export const watchAccountController = <T>(
  selector: (state: Record<string, Account>) => T,
) => watchAccountService({
    selector,
    repositories: { account: defaultRepo },
  });
