import orderGetIdea from '@fishbot/cross/api/orders/getIdea';
import orderGetMany from '@fishbot/cross/api/orders/getMany';
import orderGetManyInfo from '@fishbot/cross/api/orders/getManyInfo';
import { useQuery } from '@fishbot/cross/libs/query';
import { OrderStatus } from '@fishbot/utils/constants/order';
import { useEffect } from 'react';

import { activityFields } from '~constants/account';
import { queryKeys } from '~constants/query';
import useWatchLiveOrders from '~hooks/useWatchLiveOrders';
import useWatchPendingOrders from '~hooks/useWatchPendingOrders';
import { refreshMS } from '~utils';

interface OrdersWatchProps {
  providerId: string;
}

function OrdersWatch({ providerId }: OrdersWatchProps) {
  useEffect(() => {
    orderGetMany({ providerId, reload: true }).then((res) => {
      const orderIds = [...res.orders, ...res.positions].map((item) => item._id);
      if (!orderIds.length) return;
      orderGetManyInfo({ providerId, orderIds, fields: activityFields });
    });
    orderGetIdea({ providerId, reload: true });
  }, [providerId]);

  useQuery({
    queryFn: () => orderGetMany({ providerId, orderStatus: OrderStatus.live }).then((res) => {
      const orderIds = res.positions.map((item) => item._id);
      if (!orderIds.length) return [];
      return orderGetManyInfo({ providerId, orderIds, fields: activityFields });
    }),
    queryKey: queryKeys.orders(`${providerId}-${OrderStatus.live}`),
    refetchInterval: refreshMS,
  });

  useQuery({
    queryFn: () => orderGetMany({ providerId, orderStatus: OrderStatus.pending }).then((res) => {
      const orderIds = res.orders.map((item) => item._id);
      if (!orderIds.length) return [];
      return orderGetManyInfo({ providerId, orderIds, fields: activityFields });
    }),
    queryKey: queryKeys.orders(`${providerId}-${OrderStatus.pending}`),
    refetchInterval: refreshMS,
  });

  useWatchLiveOrders(providerId);
  useWatchPendingOrders(providerId);

  return null;
}

export default OrdersWatch;
