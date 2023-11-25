import {
  Account, AccountActivity, AccountBannerStatus, AccountConfig, AccountPlatform,
  AccountProtectSettings, AccountSettings, AccountTradeSettings, AccountTradeType,
  AccountViewType, checkRepository, ProviderType,
} from '@fishprovider/core';
import { LocalAccountRepository } from '@fishprovider/local';
import { StoreAccountRepository } from '@fishprovider/store';
import { StoreFirstAccountRepository } from '@fishprovider/store-first';

const repo = StoreFirstAccountRepository;

export const getAccountController = async (filter: {
  accountId: string,
  getTradeInfo?: boolean,
}) => {
  const getAccountRepo = checkRepository(repo.getAccount);
  const { doc: account } = await getAccountRepo(filter);
  return account;
};

export const getAccountsController = async (filter: {
  viewType?: AccountViewType,
  email?: string,
}) => {
  const getAccountsRepo = checkRepository(repo.getAccounts);
  const { docs: accounts } = await getAccountsRepo(filter);
  return accounts;
};

export const getTradeAccountsController = async (filter: {
  platform: AccountPlatform,
  baseConfig: Partial<AccountConfig>,
  tradeRequest: {
    redirectUrl: string,
    code: string,
  },
}) => {
  const getTradeAccountsRepo = checkRepository(repo.getAccounts);
  const { docs: tradeAccounts } = await getTradeAccountsRepo({
    getTradeAccounts: filter,
  });
  return tradeAccounts;
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
    const updateAccountLocalRepo = checkRepository(LocalAccountRepository.updateAccount);
    const updateAccountStoreRepo = checkRepository(StoreAccountRepository.updateAccount);
    const { doc: accountLocal } = await updateAccountLocalRepo(filter, { account: accountUpdate });
    const { doc: accountStore } = await updateAccountStoreRepo(filter, { account: accountUpdate });
    return accountLocal || accountStore;
  }

  const updateAccountRepo = checkRepository(repo.updateAccount);
  const { doc: account } = await updateAccountRepo(filter, rest);
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
  const addAccountRepo = checkRepository(repo.addAccount);
  const { doc: account } = await addAccountRepo(payload);
  return account;
};

export const removeAccountController = async (filter: {
  accountId: string,
}) => {
  const removeAccountRepo = checkRepository(repo.removeAccount);
  const { doc: account } = await removeAccountRepo(filter);
  return account;
};

export const watchAccountController = <T>(
  selector: (state: Record<string, Account>) => T,
) => {
  const watchAccountRepo = checkRepository(repo.watchAccount);
  return watchAccountRepo(selector);
};
