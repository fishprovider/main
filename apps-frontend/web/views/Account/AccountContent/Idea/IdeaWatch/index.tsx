import orderGetIdea from '@fishprovider/cross/dist/api/orders/getIdea';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';

import { watchUserInfoController } from '~controllers/user.controller';
import { refreshMS } from '~utils';

function IdeaWatch() {
  const {
    providerId = '',
  } = watchUserInfoController((state) => ({
    providerId: state.activeAccount?._id,
  }));

  useQuery({
    queryFn: () => orderGetIdea({ providerId }),
    queryKey: queryKeys.orders(`${providerId}-${OrderStatus.idea}`),
    refetchInterval: refreshMS,
  });
  return null;
}

export default IdeaWatch;
