import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';

import { updateUserController, watchUserInfoController } from '~controllers/user.controller';

function UserClean() {
  const {
    isServerLoggedIn,
    email,
  } = watchUserInfoController((state) => ({
    isServerLoggedIn: state.isServerLoggedIn,
    email: state.activeUser?.email,
  }));

  useQuery({
    queryFn: () => updateUserController({ email }, { refreshRoles: true }),
    queryKey: queryKeys.clean(),
    enabled: !!isServerLoggedIn,
    refetchInterval: 1000 * 60 * 60, // 1h
  });

  return null;
}

export default UserClean;
