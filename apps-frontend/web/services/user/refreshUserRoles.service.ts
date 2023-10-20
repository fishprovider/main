import { checkRepository } from '@fishprovider/base-services';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { DataFetchUserRepository } from '@fishprovider/data-fetch';

export const refreshUserRolesService = async () => {
  const updateUserRepo = checkRepository(DataFetchUserRepository.updateUser);
  const { doc: user } = await updateUserRepo({}, { refreshRoles: true });

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
