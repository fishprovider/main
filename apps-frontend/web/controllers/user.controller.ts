import { checkRepository } from '@fishprovider/core';
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
