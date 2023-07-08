import accountUpdate from '@fishprovider/cross/api/accounts/update';
import { useQuery } from '@fishprovider/cross/libs/query';
import storeUser from '@fishprovider/cross/stores/user';

import { queryKeys } from '~constants/query';

export default function useActivity() {
  const {
    providerId = '',
  } = storeUser.useStore((state) => ({
    providerId: state.activeProvider?._id,
  }));

  useQuery({
    queryFn: () => accountUpdate({
      providerId,
      activity: {
        lastView: new Date(),
      },
    }),
    queryKey: queryKeys.account(providerId, 'update'),
    refetchInterval: 1000 * 30, // 30s
  });
}
