import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import storeUser from '@fishprovider/cross/dist/stores/user';

import { updateAccountController } from '~controllers/account.controller';

function ActivityWatch() {
  const {
    userId,
    accountId = '',
  } = storeUser.useStore((state) => ({
    userId: state.info?._id,
    accountId: state.activeProvider?._id,
  }));

  useQuery({
    queryFn: () => updateAccountController({
      accountId,
    }, {
      addActivity: {
        userId,
        lastView: new Date(),
      },
    }),
    queryKey: queryKeys.account(accountId, 'update'),
    refetchInterval: 1000 * 30, // 30s
  });

  return null;
}

export default ActivityWatch;
