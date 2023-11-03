import { Account } from '@fishprovider/core';
import { AccountRepository, BaseGetManyResult, BaseGetResult } from '@fishprovider/core-frontend';
import { FishApiAccountRepository } from '@fishprovider/fish-api';
import { LocalAccountRepository } from '@fishprovider/local';
import { StoreAccountRepository } from '@fishprovider/store';

import { getLocalFirst, removeLocalFirst, updateLocalFirst } from '..';

const getAccount: AccountRepository['getAccount'] = async (filter, options) => {
  const getLocal = LocalAccountRepository.getAccount;
  const setLocal = LocalAccountRepository.updateAccount;
  const getStore = StoreAccountRepository.getAccount;
  const setStore = StoreAccountRepository.updateAccount;
  const getApi = FishApiAccountRepository.getAccount;

  const res = await getLocalFirst<BaseGetResult<Account>>({
    getLocal: getLocal && (() => getLocal(filter, options)),
    setLocal: setLocal && (({ doc }) => setLocal(filter, { account: doc }, options)),
    getStore: getStore && (() => getStore(filter, options)),
    setStore: setStore && (({ doc }) => setStore(filter, { account: doc }, options)),
    getApi: getApi && (() => getApi(filter, options)),
  });

  return res ?? {};
};

const getAccounts: AccountRepository['getAccounts'] = async (filter, options) => {
  const getLocal = LocalAccountRepository.getAccounts;
  const setLocal = LocalAccountRepository.updateAccounts;
  const getStore = StoreAccountRepository.getAccounts;
  const setStore = StoreAccountRepository.updateAccounts;
  const getApi = FishApiAccountRepository.getAccounts;

  const res = await getLocalFirst<BaseGetManyResult<Account>>({
    getLocal: getLocal && (() => getLocal(filter, options)),
    setLocal: setLocal && (({ docs }) => setLocal(filter, { accounts: docs }, options)),
    getStore: getStore && (() => getStore(filter, options)),
    setStore: setStore && (({ docs }) => setStore(filter, { accounts: docs }, options)),
    getApi: getApi && (() => getApi(filter, options)),
  });

  return res ?? {};
};

const updateAccount: AccountRepository['updateAccount'] = async (filter, payload) => {
  const updateApi = FishApiAccountRepository.updateAccount;
  const updateLocal = LocalAccountRepository.updateAccount;
  const updateStore = StoreAccountRepository.updateAccount;

  const res = await updateLocalFirst<BaseGetResult<Account>>({
    updateApi: updateApi && (() => updateApi(filter, payload)),
    updateLocal: updateLocal && (() => updateLocal(filter, payload)),
    updateStore: updateStore && (() => updateStore(filter, payload)),
  });

  return res ?? {};
};

const updateAccounts: AccountRepository['updateAccounts'] = async (filter, payload) => {
  const updateApi = FishApiAccountRepository.updateAccounts;
  const updateLocal = LocalAccountRepository.updateAccounts;
  const updateStore = StoreAccountRepository.updateAccounts;

  const res = await updateLocalFirst<BaseGetManyResult<Account>>({
    updateLocal: updateLocal && (() => updateLocal(filter, payload)),
    updateApi: updateApi && (() => updateApi(filter, payload)),
    updateStore: updateStore && (() => updateStore(filter, payload)),
  });

  return res ?? {};
};

const removeAccount: AccountRepository['removeAccount'] = async (filter) => {
  const removeApi = FishApiAccountRepository.removeAccount;
  const removeLocal = LocalAccountRepository.removeAccount;
  const removeStore = StoreAccountRepository.removeAccount;

  const res = await removeLocalFirst<BaseGetResult<Account>>({
    removeApi: removeApi && (() => removeApi(filter)),
    removeLocal: removeLocal && (() => removeLocal(filter)),
    removeStore: removeStore && (() => removeStore(filter)),
  });

  return res ?? {};
};

export const DataFetchAccountRepository: AccountRepository = {
  ...FishApiAccountRepository,
  getAccount,
  getAccounts,
  updateAccount,
  updateAccounts,
  removeAccount,
};
