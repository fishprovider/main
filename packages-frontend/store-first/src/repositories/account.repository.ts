import { Account } from '@fishprovider/core';
import { AccountRepository, BaseGetManyResult, BaseGetResult } from '@fishprovider/core-frontend';
import { LocalFirstAccountRepository } from '@fishprovider/local-first';
import { StoreAccountRepository } from '@fishprovider/store';

import { getStoreFirst, updateStoreFirst } from '..';

const getAccount: AccountRepository['getAccount'] = async (filter, options) => {
  const getStore = StoreAccountRepository.getAccount;
  const setStore = StoreAccountRepository.updateAccount;
  const getLocal = LocalFirstAccountRepository.getAccount;

  const res = await getStoreFirst<BaseGetResult<Account>>({
    getStore: getStore && (() => getStore(filter, options)),
    setStore: setStore && (({ doc } = {}) => setStore(filter, { account: doc }, options)),
    getLocal: getLocal && (() => getLocal(filter, options)),
  });

  return res ?? {};
};

const getAccounts: AccountRepository['getAccounts'] = async (filter, options) => {
  const getStore = StoreAccountRepository.getAccounts;
  const setStore = StoreAccountRepository.updateAccounts;
  const getLocal = LocalFirstAccountRepository.getAccounts;

  const res = await getStoreFirst<BaseGetManyResult<Account>>({
    getStore: getStore && (() => getStore(filter, options)),
    setStore: setStore && (({ docs } = {}) => setStore(filter, { accounts: docs }, options)),
    getLocal: getLocal && (() => getLocal(filter, options)),
  });

  return res ?? {};
};

const updateAccount: AccountRepository['updateAccount'] = async (filter, payload, options) => {
  const updateLocal = LocalFirstAccountRepository.updateAccount;
  const updateStore = StoreAccountRepository.updateAccount;

  const res = await updateStoreFirst<BaseGetResult<Account>>({
    updateLocal: updateLocal && (() => updateLocal(filter, payload, options)),
    updateStore: updateStore && (() => updateStore(filter, payload, options)),
  });

  return res ?? {};
};

const updateAccounts: AccountRepository['updateAccounts'] = async (filter, payload, options) => {
  const updateLocal = LocalFirstAccountRepository.updateAccounts;
  const updateStore = StoreAccountRepository.updateAccounts;

  const res = await updateStoreFirst<BaseGetManyResult<Account>>({
    updateLocal: updateLocal && (() => updateLocal(filter, payload, options)),
    updateStore: updateStore && (() => updateStore(filter, payload, options)),
  });

  return res ?? {};
};

const removeAccount: AccountRepository['removeAccount'] = async (filter) => {
  const updateLocal = LocalFirstAccountRepository.removeAccount;
  const updateStore = StoreAccountRepository.removeAccount;

  const res = await updateStoreFirst<BaseGetResult<Account>>({
    updateLocal: updateLocal && (() => updateLocal(filter)),
    updateStore: updateStore && (() => updateStore(filter)),
  });

  return res ?? {};
};

export const StoreFirstAccountRepository: AccountRepository = {
  ...StoreAccountRepository,
  ...LocalFirstAccountRepository,
  getAccount,
  getAccounts,
  updateAccount,
  updateAccounts,
  removeAccount,
};
