import { User } from '@fishprovider/core';
import { RepositoryGetResult, UserRepository } from '@fishprovider/core-frontend';
import { FishApiUserRepository } from '@fishprovider/fish-api';
import { LocalUserRepository } from '@fishprovider/local';

import { getLocalFirst, updateLocalFirst } from '..';

const getUser: UserRepository['getUser'] = async (filter, options) => {
  const getLocal = LocalUserRepository.getUser;
  const setLocal = LocalUserRepository.updateUser;
  const getApi = FishApiUserRepository.getUser;

  const res = await getLocalFirst<RepositoryGetResult<User>>({
    getLocal: getLocal && (() => getLocal(filter, options)),
    setLocal: setLocal && (({ doc } = {}) => setLocal(filter, { user: doc }, options)),
    getApi: getApi && (() => getApi(filter, options)),
  });

  return res ?? {};
};

const updateUser: UserRepository['updateUser'] = async (filter, payload, options) => {
  const updateLocal = LocalUserRepository.updateUser;
  const updateApi = FishApiUserRepository.updateUser;

  const res = await updateLocalFirst<RepositoryGetResult<User>>({
    updateLocal: updateLocal && (() => updateLocal(filter, payload, options)),
    updateApi: updateApi && (() => updateApi(filter, payload, options)),
  });

  return res ?? {};
};

export const LocalFirstUserRepository: UserRepository = {
  // ...LocalUserRepository,
  ...FishApiUserRepository,
  getUser,
  updateUser,
};
