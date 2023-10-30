import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import storeUser from '@fishprovider/cross/dist/stores/user';

import { refreshUserRolesService } from '~services/user/refreshUserRoles.service';

function UserClean() {
  const {
    isServerLoggedIn,
    email,
  } = storeUser.useStore((state) => ({
    isServerLoggedIn: state.isServerLoggedIn,
    email: state.info?.email,
  }));

  useQuery({
    queryFn: () => refreshUserRolesService({ email }),
    queryKey: queryKeys.clean(),
    enabled: !!isServerLoggedIn,
    refetchInterval: 1000 * 60 * 60, // 1h
  });

  return null;
}

export default UserClean;
