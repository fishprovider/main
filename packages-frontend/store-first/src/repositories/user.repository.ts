import { User } from '@fishprovider/core';
import { BaseGetResult, UserRepository } from '@fishprovider/core-frontend';
import { LocalFirstUserRepository } from '@fishprovider/local-first';
import { StoreUserRepository } from '@fishprovider/store';

import { getStoreFirst, updateStoreFirst } from '..';

const getUser: UserRepository['getUser'] = async (filter, options) => {
  const getStore = StoreUserRepository.getUser;
  const setStore = StoreUserRepository.updateUser;
  const getLocal = LocalFirstUserRepository.getUser;

  const res = await getStoreFirst<BaseGetResult<User>>({
    getStore: getStore && (() => getStore(filter, options)),
    setStore: setStore && (({ doc } = {}) => setStore(filter, { user: doc }, options)),
    getLocal: getLocal && (() => getLocal(filter, options)),
  });

  return res ?? {};
};

const updateUser: UserRepository['updateUser'] = async (filter, payload) => {
  const updateLocal = LocalFirstUserRepository.updateUser;
  const updateStore = StoreUserRepository.updateUser;

  const res = await updateStoreFirst<BaseGetResult<User>>({
    updateLocal: updateLocal && (() => updateLocal(filter, payload)),
    updateStore: updateStore && (() => updateStore(filter, payload)),
  });

  return res ?? {};
};

export const StoreFirstUserRepository: UserRepository = {
  ...StoreUserRepository,
  ...LocalFirstUserRepository,
  getUser,
  updateUser,
};
