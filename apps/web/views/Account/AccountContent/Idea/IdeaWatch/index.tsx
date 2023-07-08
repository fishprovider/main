import orderGetIdea from '@fishprovider/cross/api/orders/getIdea';
import { useQuery } from '@fishprovider/cross/libs/query';
import storeUser from '@fishprovider/cross/stores/user';
import { OrderStatus } from '@fishprovider/utils/constants/order';

import { queryKeys } from '~constants/query';
import { refreshMS } from '~utils';

function IdeaWatch() {
  const {
    providerId = '',
  } = storeUser.useStore((state) => ({
    providerId: state.activeProvider?._id,
  }));

  useQuery({
    queryFn: () => orderGetIdea({ providerId }),
    queryKey: queryKeys.orders(`${providerId}-${OrderStatus.idea}`),
    refetchInterval: refreshMS,
  });
  return null;
}

export default IdeaWatch;
