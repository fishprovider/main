import { Account } from '@fishprovider/core';
import { AccountRepository, BaseGetManyResult, BaseGetResult } from '@fishprovider/core-frontend';
import { FishApiAccountRepository } from '@fishprovider/fish-api';
import { LocalAccountRepository } from '@fishprovider/local';
import { StoreAccountRepository } from '@fishprovider/store';

import { getLocalFirst, updateLocalFirst } from '..';

const getAccount: AccountRepository['getAccount'] = async (filter, options) => {
  const getStore = StoreAccountRepository.getAccount;
  const setStore = StoreAccountRepository.updateAccount;
  const getLocal = LocalAccountRepository.getAccount;
  const setLocal = LocalAccountRepository.updateAccount;
  const getApi = FishApiAccountRepository.getAccount;

  const res = await getLocalFirst<BaseGetResult<Account>>({
    getStore: getStore && (() => getStore(filter, options)),
    setStore: setStore && (({ doc } = {}) => setStore(filter, { account: doc }, options)),
    getLocal: getLocal && (() => getLocal(filter, options)),
    setLocal: setLocal && (({ doc } = {}) => setLocal(filter, { account: doc }, options)),
    getApi: getApi && (() => getApi(filter, options)),
  });

  return res ?? {};
};

const getAccounts: AccountRepository['getAccounts'] = async (filter, options) => {
  const getStore = StoreAccountRepository.getAccounts;
  const setStore = StoreAccountRepository.updateAccounts;
  const getLocal = LocalAccountRepository.getAccounts;
  const setLocal = LocalAccountRepository.updateAccounts;
  const getApi = FishApiAccountRepository.getAccounts;

  const res = await getLocalFirst<BaseGetManyResult<Account>>({
    getStore: getStore && (() => getStore(filter, options)),
    setStore: setStore && (({ docs } = {}) => setStore(filter, { accounts: docs }, options)),
    getLocal: getLocal && (() => getLocal(filter, options)),
    setLocal: setLocal && (({ docs } = {}) => setLocal(filter, { accounts: docs }, options)),
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
  const updateApi = FishApiAccountRepository.removeAccount;
  const updateLocal = LocalAccountRepository.removeAccount;
  const updateStore = StoreAccountRepository.removeAccount;

  const res = await updateLocalFirst<BaseGetResult<Account>>({
    updateApi: updateApi && (() => updateApi(filter)),
    updateLocal: updateLocal && (() => updateLocal(filter)),
    updateStore: updateStore && (() => updateStore(filter)),
  });

  return res ?? {};
};

export const LocalFirstAccountRepository: AccountRepository = {
  ...FishApiAccountRepository,
  getAccount,
  getAccounts,
  updateAccount,
  updateAccounts,
  removeAccount,
};
