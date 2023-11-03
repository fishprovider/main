import { Account } from '@fishprovider/core';
import { AccountRepository, BaseGetManyResult, BaseGetResult } from '@fishprovider/core-frontend';
import { FishApiAccountRepository } from '@fishprovider/fish-api';
import { LocalAccountRepository } from '@fishprovider/local';
import { StoreAccountRepository } from '@fishprovider/store';

import {
  getDoc, getDocs, removeDoc, updateDoc, updateDocs,
} from '..';

const getAccount: AccountRepository['getAccount'] = async (filter, options) => {
  const getDocLocal = LocalAccountRepository.getAccount;
  const setDocLocal = LocalAccountRepository.updateAccount;
  const getDocStore = StoreAccountRepository.getAccount;
  const setDocStore = StoreAccountRepository.updateAccount;
  const getDocApi = FishApiAccountRepository.getAccount;

  const res = await getDoc<BaseGetResult<Account>>({
    getDocLocal: getDocLocal
      && (() => getDocLocal(filter, options)),
    setDocLocal: setDocLocal
      && (({ doc }) => setDocLocal(filter, { account: doc }, options)),
    getDocStore: getDocStore
      && (() => getDocStore(filter, options)),
    setDocStore: setDocStore
      && (({ doc }) => setDocStore(filter, { account: doc }, options)),
    getDocApi: getDocApi
      && (() => getDocApi(filter, options)),
  });

  return res ?? {};
};

const getAccounts: AccountRepository['getAccounts'] = async (filter, options) => {
  const getDocsLocal = LocalAccountRepository.getAccounts;
  const setDocsLocal = LocalAccountRepository.updateAccounts;
  const getDocsStore = StoreAccountRepository.getAccounts;
  const setDocsStore = StoreAccountRepository.updateAccounts;
  const getDocsApi = FishApiAccountRepository.getAccounts;

  const res = await getDocs<BaseGetManyResult<Account>>({
    getDocsLocal: getDocsLocal
       && (() => getDocsLocal(filter, options)),
    setDocsLocal: setDocsLocal
       && (({ docs }) => setDocsLocal(filter, { accounts: docs }, options)),
    getDocsStore: getDocsStore
       && (() => getDocsStore(filter, options)),
    setDocsStore: setDocsStore
       && (({ docs }) => setDocsStore(filter, { accounts: docs }, options)),
    getDocsApi: getDocsApi
      && (() => getDocsApi(filter, options)),
  });

  return res ?? {};
};

const updateAccount: AccountRepository['updateAccount'] = async (filter, payload) => {
  const updateDocLocal = LocalAccountRepository.updateAccount;
  const updateDocStore = StoreAccountRepository.updateAccount;
  const updateDocApi = FishApiAccountRepository.updateAccount;

  const res = await updateDoc<BaseGetResult<Account>>({
    updateDocLocal: updateDocLocal && (() => updateDocLocal(filter, payload)),
    updateDocStore: updateDocStore && (() => updateDocStore(filter, payload)),
    updateDocApi: updateDocApi && (() => updateDocApi(filter, payload)),
  });

  return res ?? {};
};

const updateAccounts: AccountRepository['updateAccounts'] = async (filter, payload) => {
  const updateDocsLocal = LocalAccountRepository.updateAccounts;
  const updateDocsStore = StoreAccountRepository.updateAccounts;
  const updateDocsApi = FishApiAccountRepository.updateAccounts;

  const res = await updateDocs<BaseGetManyResult<Account>>({
    updateDocsLocal: updateDocsLocal && (() => updateDocsLocal(filter, payload)),
    updateDocsStore: updateDocsStore && (() => updateDocsStore(filter, payload)),
    updateDocsApi: updateDocsApi && (() => updateDocsApi(filter, payload)),
  });

  return res ?? {};
};

const removeAccount: AccountRepository['removeAccount'] = async (filter) => {
  const removeDocLocal = LocalAccountRepository.removeAccount;
  const removeDocStore = StoreAccountRepository.removeAccount;
  const removeDocApi = FishApiAccountRepository.removeAccount;

  const res = await removeDoc<BaseGetResult<Account>>({
    removeDocLocal: removeDocLocal && (() => removeDocLocal(filter)),
    removeDocStore: removeDocStore && (() => removeDocStore(filter)),
    removeDocApi: removeDocApi && (() => removeDocApi(filter)),
  });

  return res ?? {};
};

// TODO: addAccount should update cache

export const DataFetchAccountRepository: AccountRepository = {
  ...FishApiAccountRepository,
  getAccount,
  getAccounts,
  updateAccount,
  updateAccounts,
  removeAccount,
};
