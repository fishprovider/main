import { UserRepository } from '@fishprovider/core-frontend';

import { storeUserInfo, storeUsers } from '..';

const updateUser: UserRepository['updateUser'] = async (_filter, payload) => {
  const { user } = payload;
  if (user) {
    storeUsers.mergeDoc(user);
    storeUserInfo.mergeState({
      activeUser: {
        ...storeUserInfo.getState().activeUser,
        ...user,
      },
    });
  }
  return { doc: user };
};

const watchUser: UserRepository['watchUser'] = (selector) => storeUsers.useStore(selector);

const watchUserInfo: UserRepository['watchUserInfo'] = (selector) => storeUserInfo.useStore(selector);

const getUserInfo: UserRepository['getUserInfo'] = () => storeUserInfo.getState();

const updateUserInfo: UserRepository['updateUserInfo'] = (payload) => {
  storeUserInfo.mergeState(payload);
};

export const StoreUserRepository: UserRepository = {
  updateUser,
  watchUser,
  watchUserInfo,
  getUserInfo,
  updateUserInfo,
};
