import orderGetIdea from '@fishprovider/cross/dist/api/orders/getIdea';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';

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
