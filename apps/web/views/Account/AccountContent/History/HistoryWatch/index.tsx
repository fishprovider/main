import orderGetHistory from '@fishbot/cross/api/orders/getHistory';
import orderGetManyInfo from '@fishbot/cross/api/orders/getManyInfo';
import { useQuery } from '@fishbot/cross/libs/query';
import storeUser from '@fishbot/cross/stores/user';
import { OrderStatus } from '@fishbot/utils/constants/order';
import { useEffect } from 'react';

import { activityFields } from '~constants/account';
import { queryKeys } from '~constants/query';
import useWatchHistoryOrders from '~hooks/useWatchHistoryOrders';
import { refreshMS } from '~utils';

function HistoryWatch() {
  const {
    providerId = '',
  } = storeUser.useStore((state) => ({
    providerId: state.activeProvider?._id,
  }));

  useEffect(() => {
    orderGetHistory({ providerId, days: 1, reload: true }).then((deals) => {
      const orderIds = deals.map((item) => item._id);
      if (!orderIds.length) return;
      orderGetManyInfo({ providerId, orderIds, fields: activityFields });
    });
  }, [providerId]);

  useQuery({
    queryFn: () => orderGetHistory({ providerId, days: 1 }).then((deals) => {
      const orderIds = deals.map((item) => item._id);
      if (!orderIds.length) return [];
      return orderGetManyInfo({ providerId, orderIds, fields: activityFields });
    }),
    queryKey: queryKeys.orders(`${providerId}-${OrderStatus.closed}`),
    refetchInterval: refreshMS,
  });

  useWatchHistoryOrders(providerId);

  return null;
}

export default HistoryWatch;
