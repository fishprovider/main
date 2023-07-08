import userClean from '@fishprovider/cross/api/users/clean';
import { useQuery } from '@fishprovider/cross/libs/query';
import storeUser from '@fishprovider/cross/stores/user';

import { queryKeys } from '~constants/query';

const useUserClean = () => {
  const {
    isServerLoggedIn,
  } = storeUser.useStore((state) => ({
    isServerLoggedIn: state.isServerLoggedIn,
  }));

  useQuery({
    queryFn: () => userClean({
      // TODO:
    }),
    queryKey: queryKeys.clean(),
    enabled: !!isServerLoggedIn,
    refetchInterval: 1000 * 60 * 60, // 1h
  });
};

export default useUserClean;
