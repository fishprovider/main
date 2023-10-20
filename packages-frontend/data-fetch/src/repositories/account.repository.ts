import { AccountFull } from '@fishprovider/core';
import { FishApiAccountRepository } from '@fishprovider/fish-api';
import { LocalAccountRepository } from '@fishprovider/local';
import { AccountRepository } from '@fishprovider/repositories';
import { StoreAccountRepository } from '@fishprovider/store';

import { getDoc, getDocs } from '..';

const getAccount: AccountRepository['getAccount'] = async (filter, options) => {
  const getDocLocal = LocalAccountRepository.getAccount;
  const setDocLocal = LocalAccountRepository.updateAccount;
  const setDocStore = StoreAccountRepository.updateAccount;
  const getDocApi = FishApiAccountRepository.getAccount;

  const account = await getDoc<Partial<AccountFull>>({
    getDocLocal: getDocLocal && (() => getDocLocal(filter, options).then((res) => res.doc)),
    setDocLocal: setDocLocal && ((doc) => setDocLocal(filter, { doc }, options)),
    setDocStore: setDocStore && ((doc) => setDocStore(filter, { doc }, options)),
    getDocApi: getDocApi && (() => getDocApi(filter, options).then((res) => res.doc)),
  });

  return { doc: account };
};

const getAccounts: AccountRepository['getAccounts'] = async (filter, options) => {
  const getDocsLocal = LocalAccountRepository.getAccounts;
  const setDocsLocal = LocalAccountRepository.updateAccounts;
  const setDocsStore = StoreAccountRepository.updateAccounts;
  const getDocsApi = FishApiAccountRepository.getAccounts;

  const accounts = await getDocs<Partial<AccountFull>>({
    getDocsLocal: getDocsLocal && (() => getDocsLocal(filter, options).then((res) => res.docs)),
    setDocsLocal: setDocsLocal && ((docs) => setDocsLocal(filter, { accounts: docs }, options)),
    setDocsStore: setDocsStore && ((docs) => setDocsStore(filter, { accounts: docs }, options)),
    getDocsApi: getDocsApi && (() => getDocsApi(filter, options).then((res) => res.docs)),
  });

  return { docs: accounts };
};

export const DataFetchAccountRepository: AccountRepository = {
  ...FishApiAccountRepository,
  getAccount,
  getAccounts,
};
