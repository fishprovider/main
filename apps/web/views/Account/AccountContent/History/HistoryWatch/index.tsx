import orderGetHistory from '@fishprovider/cross/dist/api/orders/getHistory';
import orderGetManyInfo from '@fishprovider/cross/dist/api/orders/getManyInfo';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import storeOrders from '@fishprovider/cross/dist/stores/orders';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';
import { redisKeys } from '@fishprovider/utils/dist/constants/redis';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import { useEffect, useRef } from 'react';

import { activityFields } from '~constants/account';
import { refreshMS } from '~utils';

const getChannel = redisKeys.historyOrders;

function useHistoryOrdersSocket(providerId: string) {
  const socket = storeUser.useStore((state) => state.socket);

  const prevChannel = useRef<string>();
  useEffect(() => {
    prevChannel.current = getChannel(providerId);
  });

  useEffect(() => {
    if (socket) {
      if (prevChannel.current) {
        Logger.debug('[socket] unsub from prev', prevChannel.current);
        socket.off(prevChannel.current);
        socket.emit('leave', prevChannel.current);
      }

      const channel = getChannel(providerId);
      Logger.debug('[socket] sub', channel);
      socket.emit('join', channel);
      socket.on(channel, (docs: Order[]) => {
        storeOrders.mergeDocs(docs);
      });
    } else {
      Logger.debug('Skipped useHistoryOrdersSocket', providerId);
    }
    return () => {
      if (socket) {
        const channel = getChannel(providerId);
        Logger.debug('[socket] unsub', channel);
        socket.off(channel);
        socket.emit('leave', channel);
      }
    };
  }, [socket, providerId]);
}

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

  useHistoryOrdersSocket(providerId);

  return null;
}

export default HistoryWatch;
