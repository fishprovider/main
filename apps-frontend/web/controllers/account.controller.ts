import { ClientOnlyAccountRepository } from '@fishprovider/client-only';
import {
  Account, AccountActivity, AccountBannerStatus, AccountConfig, AccountMember, AccountPlatform,
  AccountProtectSettings, AccountSettings, AccountTradeSettings, AccountTradeType,
  AccountViewType, ProviderType,
} from '@fishprovider/core';
import {
  addAccountService, BaseGetOptions, BaseUpdateOptions,
  getAccountService, getAccountsService,
  removeAccountService, updateAccountService, watchAccountService,
} from '@fishprovider/core-frontend';
import { StoreFirstAccountRepository } from '@fishprovider/store-first';

export const getAccountController = async (
  filter: {
    accountId: string,
    getTradeAccount?: boolean,
  },
  options?: BaseGetOptions<Account>,
) => {
  const { doc: account } = await getAccountService({
    filter,
    repositories: { account: StoreFirstAccountRepository },
    options,
  });
  return account;
};

export const getAccountsController = async (
  filter: {
    viewType?: AccountViewType,
    getTradeAccounts?: {
      platform: AccountPlatform,
      baseConfig: Partial<AccountConfig>,
      tradeRequest?: {
        redirectUrl: string,
        code: string,
      },
    },
  },
  options?: BaseGetOptions<Account>,
) => {
  const { docs: accounts } = await getAccountsService({
    filter,
    repositories: { account: StoreFirstAccountRepository },
    options,
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
    addMember?: AccountMember,
    removeMemberEmail?: string,
    account?: Partial<Account>,
  },
  options?: BaseUpdateOptions<Account>,
) => {
  const { doc: account } = await updateAccountService({
    filter,
    payload,
    repositories: {
      account: StoreFirstAccountRepository,
      clientOnly: ClientOnlyAccountRepository,
    },
    options,
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
  options?: BaseUpdateOptions<Account>,
) => {
  const { doc: account } = await addAccountService({
    payload,
    repositories: { account: StoreFirstAccountRepository },
    options,
  });
  return account;
};

export const removeAccountController = async (
  filter: {
    accountId: string,
  },
  options?: BaseUpdateOptions<Account>,
) => {
  const { doc: account } = await removeAccountService({
    filter,
    repositories: { account: StoreFirstAccountRepository },
    options,
  });
  return account;
};

export const watchAccountController = <T>(
  selector: (state: Record<string, Account>) => T,
) => watchAccountService({
    selector,
    repositories: { account: StoreFirstAccountRepository },
  });
