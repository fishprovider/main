import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';

import { updateAccountController } from '~controllers/account.controller';
import { watchUserInfoController } from '~controllers/user.controller';

function ActivityWatch() {
  const {
    userId,
    accountId = '',
  } = watchUserInfoController((state) => ({
    userId: state.activeUser?._id,
    accountId: state.activeAccount?._id,
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
