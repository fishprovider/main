import { User } from '@fishprovider/core';
import { BaseGetResult, UserRepository } from '@fishprovider/core-frontend';
import { FishApiUserRepository } from '@fishprovider/fish-api';
import { LocalUserRepository } from '@fishprovider/local';
import { StoreUserRepository } from '@fishprovider/store';

import { getDoc } from '..';

const getUser: UserRepository['getUser'] = async (filter, options) => {
  const getDocLocal = LocalUserRepository.getUser;
  const setDocLocal = LocalUserRepository.updateUser;
  const setDocStore = StoreUserRepository.updateUser;
  const getDocApi = FishApiUserRepository.getUser;

  const res = await getDoc<BaseGetResult<User>>({
    getDocLocal: getDocLocal && (() => getDocLocal(filter, options)),
    setDocLocal: setDocLocal && (({ doc }) => setDocLocal(filter, { user: doc }, options)),
    setDocStore: setDocStore && (({ doc }) => setDocStore(filter, { user: doc }, options)),
    getDocApi: getDocApi && (() => getDocApi(filter, options)),
  });

  return res ?? {};
};

export const DataFetchUserRepository: UserRepository = {
  ...FishApiUserRepository,
  getUser,
};
