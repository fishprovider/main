import { User } from '@fishprovider/core';
import { FishApiUserRepository } from '@fishprovider/fish-api';
import { LocalUserRepository } from '@fishprovider/local';
import { UserRepository } from '@fishprovider/repositories';
import { StoreUserRepository } from '@fishprovider/store';

import { getDoc } from '..';

const getUser: UserRepository['getUser'] = async (filter, options) => {
  const getDocLocal = LocalUserRepository.getUser;
  const setDocLocal = LocalUserRepository.updateUser;
  const setDocStore = StoreUserRepository.updateUser;
  const getDocApi = FishApiUserRepository.getUser;

  const user = await getDoc<Partial<User>>({
    getDocLocal: getDocLocal && (() => getDocLocal(filter, options).then((res) => res.doc)),
    setDocLocal: setDocLocal && ((doc) => setDocLocal(filter, { doc }, options)),
    setDocStore: setDocStore && ((doc) => setDocStore(filter, { doc }, options)),
    getDocApi: getDocApi && (() => getDocApi(filter, options).then((res) => res.doc)),
  });

  return { doc: user };
};

export const DataFetchUserRepository: UserRepository = {
  ...FishApiUserRepository,
  getUser,
};
