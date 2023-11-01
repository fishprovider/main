import { Account } from '@fishprovider/core';
import { AccountRepository } from '@fishprovider/core-frontend';
import { FishApiAccountRepository } from '@fishprovider/fish-api';
import { LocalAccountRepository } from '@fishprovider/local';
import { StoreAccountRepository } from '@fishprovider/store';

import { getDoc, getDocs, removeDoc } from '..';

const getAccount: AccountRepository['getAccount'] = async (filter, options) => {
  const getDocLocal = LocalAccountRepository.getAccount;
  const setDocLocal = LocalAccountRepository.updateAccount;
  const setDocStore = StoreAccountRepository.updateAccount;
  const getDocApi = FishApiAccountRepository.getAccount;

  const account = await getDoc<Partial<Account>>({
    getDocLocal: getDocLocal && (() => getDocLocal(filter, options).then((res) => res.doc)),
    setDocLocal: setDocLocal && ((doc) => setDocLocal(filter, { account: doc }, options)),
    setDocStore: setDocStore && ((doc) => setDocStore(filter, { account: doc }, options)),
    getDocApi: getDocApi && (() => getDocApi(filter, options).then((res) => res.doc)),
  });

  return { doc: account };
};

const getAccounts: AccountRepository['getAccounts'] = async (filter, options) => {
  const getDocsLocal = LocalAccountRepository.getAccounts;
  const setDocsLocal = LocalAccountRepository.updateAccounts;
  const setDocsStore = StoreAccountRepository.updateAccounts;
  const getDocsApi = FishApiAccountRepository.getAccounts;

  const accounts = await getDocs<Partial<Account>>({
    getDocsLocal: getDocsLocal && (() => getDocsLocal(filter, options).then((res) => res.docs)),
    setDocsLocal: setDocsLocal && ((docs) => setDocsLocal(filter, { accounts: docs }, options)),
    setDocsStore: setDocsStore && ((docs) => setDocsStore(filter, { accounts: docs }, options)),
    getDocsApi: getDocsApi && (() => getDocsApi(filter, options).then((res) => res.docs)),
  });

  return { docs: accounts };
};

const removeAccount: AccountRepository['removeAccount'] = async (filter) => {
  const removeDocLocal = LocalAccountRepository.removeAccount;
  const removeDocStore = StoreAccountRepository.removeAccount;
  const removeDocApi = FishApiAccountRepository.removeAccount;

  await removeDoc({
    removeDocLocal: removeDocLocal && (() => removeDocLocal(filter)),
    removeDocStore: removeDocStore && (() => removeDocStore(filter)),
    removeDocApi: removeDocApi && (() => removeDocApi(filter)),
  });
};

export const DataFetchAccountRepository: AccountRepository = {
  ...FishApiAccountRepository,
  getAccount,
  getAccounts,
  removeAccount,
};
