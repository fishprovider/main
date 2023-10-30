import { checkRepository } from '@fishprovider/core-frontend';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { DataFetchUserRepository } from '@fishprovider/data-fetch';

export const refreshUserRolesService = async (filter: {
  email?: string,
}) => {
  const updateUserRepo = checkRepository(DataFetchUserRepository.updateUser);
  const { doc: user } = await updateUserRepo(filter, { refreshRoles: true });

  if (user) {
    // TODO: migrate to DataFetchUserRepository
    storeUser.mergeState({
      info: {
        ...storeUser.getState().info,
        ...user,
      },
    });
  }

  return user;
};
