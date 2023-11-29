import { UserRepository } from '@fishprovider/core-frontend';
import _ from 'lodash';

import { storeUserInfo, storeUsers } from '..';

const getUser: UserRepository['getUser'] = async (filter) => {
  const { email } = filter;
  if (!email) return {};

  const account = _.find(storeUsers.getState(), (user) => user.email === email);
  return { doc: account };
};

const updateUser: UserRepository['updateUser'] = async (_filter, payload) => {
  const { user } = payload;
  if (user) {
    storeUsers.mergeDoc(user);
  }
  return { doc: user };
};

const watchUser: UserRepository['watchUser'] = (selector) => storeUsers.useStore(selector);

const getUserInfo: UserRepository['getUserInfo'] = () => storeUserInfo.getState();
const updateUserInfo: UserRepository['updateUserInfo'] = (payload) => storeUserInfo.mergeState(payload);
const watchUserInfo: UserRepository['watchUserInfo'] = (selector) => storeUserInfo.useStore(selector);

export const StoreUserRepository: UserRepository = {
  getUser,
  updateUser,
  watchUser,
  getUserInfo,
  updateUserInfo,
  watchUserInfo,
};
