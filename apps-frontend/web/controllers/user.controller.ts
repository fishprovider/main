import { checkRepository, User } from '@fishprovider/core';
import { UserInfo } from '@fishprovider/core-frontend';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { StoreFirstUserRepository } from '@fishprovider/store-first';

const repo = StoreFirstUserRepository;

export const getUserController = async (filter: {
  email?: string,
}) => {
  const getUserRepo = checkRepository(repo.getUser);
  const { doc: user } = await getUserRepo(filter);
  if (user) { // TODO: remove
    storeUser.mergeState({
      info: {
        ...storeUser.getState().info,
        ...user,
      },
    });
  }
  return user;
};

export const updateUserController = async (
  filter: {
    email?: string,
  },
  payload: {
    name?: string,
    starAccount?: {
      accountId: string
      enabled: boolean
    }
  },
) => {
  const updateUserRepo = checkRepository(repo.updateUser);
  const { doc: user } = await updateUserRepo(filter, payload);
  if (user) { // TODO: remove
    storeUser.mergeState({
      info: {
        ...storeUser.getState().info,
        ...user,
      },
    });
  }
  return user;
};

export const refreshUserRolesController = async (filter: {
  email?: string,
}) => {
  const updateUserRepo = checkRepository(repo.updateUser);
  const { doc: user } = await updateUserRepo(filter, { refreshRoles: true });
  if (user) { // TODO: remove
    storeUser.mergeState({
      info: {
        ...storeUser.getState().info,
        ...user,
      },
    });
  }
  return user;
};

export const watchUserController = <T>(
  selector: (state: Record<string, User>) => T,
) => {
  const watchUserRepo = checkRepository(repo.watchUser);
  return watchUserRepo(selector);
};

export const watchUserInfoController = <T>(
  selector: (state: Record<string, UserInfo>) => T,
) => {
  const watchUserInfoRepo = checkRepository(repo.watchUserInfo);
  return watchUserInfoRepo(selector);
};
