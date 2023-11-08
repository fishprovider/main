import { checkRepository } from '@fishprovider/core';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { StoreFirstUserRepository } from '@fishprovider/store-first';

export const refreshUserRolesService = async (filter: {
  email?: string,
}) => {
  const updateUserRepo = checkRepository(StoreFirstUserRepository.updateUser);
  const { doc: user } = await updateUserRepo(filter, { refreshRoles: true });

  if (user) {
    // TODO: migrate to StoreFirstUserRepository
    storeUser.mergeState({
      info: {
        ...storeUser.getState().info,
        ...user,
      },
    });
  }

  return user;
};
