import { checkRepository } from '@fishprovider/core';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { LocalFirstUserRepository } from '@fishprovider/local-first';

export const refreshUserRolesService = async (filter: {
  email?: string,
}) => {
  const updateUserRepo = checkRepository(LocalFirstUserRepository.updateUser);
  const { doc: user } = await updateUserRepo(filter, { refreshRoles: true });

  if (user) {
    // TODO: migrate to LocalFirstUserRepository
    storeUser.mergeState({
      info: {
        ...storeUser.getState().info,
        ...user,
      },
    });
  }

  return user;
};
