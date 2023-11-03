import { User } from '@fishprovider/core';
import { BaseGetResult, UserRepository } from '@fishprovider/core-frontend';
import { FishApiUserRepository } from '@fishprovider/fish-api';
import { LocalUserRepository } from '@fishprovider/local';
import { StoreUserRepository } from '@fishprovider/store';

import { getLocalFirst, updateLocalFirst } from '..';

const getUser: UserRepository['getUser'] = async (filter, options) => {
  const getLocal = LocalUserRepository.getUser;
  const setLocal = LocalUserRepository.updateUser;
  const setStore = StoreUserRepository.updateUser;
  const getApi = FishApiUserRepository.getUser;

  const res = await getLocalFirst<BaseGetResult<User>>({
    getLocal: getLocal && (() => getLocal(filter, options)),
    setLocal: setLocal && (({ doc } = {}) => setLocal(filter, { user: doc }, options)),
    setStore: setStore && (({ doc } = {}) => setStore(filter, { user: doc }, options)),
    getApi: getApi && (() => getApi(filter, options)),
  });

  return res ?? {};
};

const updateUser: UserRepository['updateUser'] = async (filter, payload) => {
  const updateLocal = LocalUserRepository.updateUser;
  const updateStore = StoreUserRepository.updateUser;
  const updateApi = FishApiUserRepository.updateUser;

  const res = await updateLocalFirst<BaseGetResult<User>>({
    updateLocal: updateLocal && (() => updateLocal(filter, payload)),
    updateStore: updateStore && (() => updateStore(filter, payload)),
    updateApi: updateApi && (() => updateApi(filter, payload)),
  });

  return res ?? {};
};

export const DataFetchUserRepository: UserRepository = {
  ...FishApiUserRepository,
  getUser,
  updateUser,
};
