import accountUpdate from '@fishprovider/cross/dist/api/accounts/update';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import storeUser from '@fishprovider/cross/dist/stores/user';

import { queryKeys } from '~constants/query';

function ActivityWatch() {
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

  return null;
}

export default ActivityWatch;
