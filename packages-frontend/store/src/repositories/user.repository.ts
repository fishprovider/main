import { UserRepository } from '@fishprovider/core-frontend';

import { storeUserInfo, storeUsers } from '..';

const updateUser: UserRepository['updateUser'] = async (_filter, payload) => {
  const { user } = payload;
  if (user) {
    storeUsers.mergeDoc(user);
  }
  return { doc: user };
};

const watchUser: UserRepository['watchUser'] = storeUsers.useStore;

const watchUserInfo: UserRepository['watchUserInfo'] = storeUserInfo.useStore;
const getUserInfo: UserRepository['getUserInfo'] = storeUserInfo.getState;
const updateUserInfo: UserRepository['updateUserInfo'] = storeUserInfo.mergeState;

export const StoreUserRepository: UserRepository = {
  updateUser,
  watchUser,
  watchUserInfo,
  getUserInfo,
  updateUserInfo,
};
