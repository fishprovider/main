import {
  AccountActivity, AccountBannerStatus, AccountConfig, AccountPlatform, AccountProtectSettings,
  AccountSettings, AccountTradeSettings, AccountTradeType, AccountType, AccountViewType,
  checkRepository,
} from '@fishprovider/core';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import { StoreFirstAccountRepository } from '@fishprovider/store-first';
import { Account } from '@fishprovider/utils/types/Account.model';

const repo = StoreFirstAccountRepository;

export const getAccountController = async (filter: {
  accountId: string,
  getTradeInfo?: boolean,
}) => {
  const getAccountRepo = checkRepository(repo.getAccount);
  const { doc: account } = await getAccountRepo(filter);
  if (account) { // TODO: remove
    storeAccounts.mergeDoc(account as Partial<Account>);
  }
  return account;
};

export const getAccountsController = async (filter: {
  accountViewType?: AccountViewType,
  email?: string,
}) => {
  const getAccountsRepo = checkRepository(repo.getAccounts);
  const { docs: accounts } = await getAccountsRepo(filter);
  if (accounts) { // TODO: remove
    storeAccounts.mergeDocs(accounts as Partial<Account>[]);
  }
  return accounts;
};

export const getTradeAccountsController = async (filter: {
  accountPlatform: AccountPlatform,
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
  const updateAccountRepo = checkRepository(repo.updateAccount);
  const { doc: account } = await updateAccountRepo(filter, payload);
  if (account) { // TODO: remove
    storeAccounts.mergeDoc(account as Partial<Account>);
  }
};

export const addAccountController = async (
  payload: {
    name: string,
    accountType: AccountType,
    accountPlatform: AccountPlatform,
    accountTradeType: AccountTradeType,
    baseConfig: Partial<AccountConfig>,
  },
) => {
  const addAccountRepo = checkRepository(repo.addAccount);
  const { doc: account } = await addAccountRepo(payload);
  if (account) { // TODO: remove
    storeAccounts.mergeDoc(account as Partial<Account>);
  }
  return account;
};

export const removeAccountController = async (filter: {
  accountId: string,
}) => {
  const removeAccountRepo = checkRepository(repo.removeAccount);
  await removeAccountRepo(filter);
  storeAccounts.removeDoc(filter.accountId); // TODO: remove
};
