import userClean from '@fishprovider/cross/dist/api/user/clean';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import storeUser from '@fishprovider/cross/dist/stores/user';

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
