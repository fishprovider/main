import orderGetIdea from '@fishprovider/cross/dist/api/orders/getIdea';
import orderGetMany from '@fishprovider/cross/dist/api/orders/getMany';
import orderGetManyInfo from '@fishprovider/cross/dist/api/orders/getManyInfo';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import storeOrders from '@fishprovider/cross/dist/stores/orders';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';
import { redisKeys } from '@fishprovider/utils/dist/constants/redis';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import { useEffect, useRef } from 'react';

import { refreshMS } from '~utils';

function useLiveOrdersSocket(providerId: string) {
  const socket = storeUser.useStore((state) => state.socket);

  const prevChannel = useRef<string>();
  useEffect(() => {
    prevChannel.current = redisKeys.liveOrders(providerId);
  });

  useEffect(() => {
    if (socket) {
      if (prevChannel.current) {
        console.log('[socket] unsub from prev', prevChannel.current);
        socket.off(prevChannel.current);
        socket.emit('leave', prevChannel.current);
      }

      const channel = redisKeys.liveOrders(providerId);
      console.log('[socket] sub', channel);
      socket.emit('join', channel);
      socket.on(channel, (docs: Order[]) => {
        storeOrders.mergeDocs(docs);
      });
    } else {
      console.log('Skipped useLiveOrdersSocket', providerId);
    }
    return () => {
      if (socket) {
        const channel = redisKeys.liveOrders(providerId);
        console.log('[socket] unsub', channel);
        socket.off(channel);
        socket.emit('leave', channel);
      }
    };
  }, [socket, providerId]);
}

function usePendingOrdersSocket(providerId: string) {
  const socket = storeUser.useStore((state) => state.socket);

  const prevChannel = useRef<string>();
  useEffect(() => {
    prevChannel.current = redisKeys.pendingOrders(providerId);
  });

  useEffect(() => {
    if (socket) {
      if (prevChannel.current) {
        console.log('[socket] unsub from prev', prevChannel.current);
        socket.off(prevChannel.current);
        socket.emit('leave', prevChannel.current);
      }

      const channel = redisKeys.pendingOrders(providerId);
      console.log('[socket] sub', channel);
      socket.emit('join', channel);
      socket.on(channel, (docs: Order[]) => {
        storeOrders.mergeDocs(docs);
      });
    } else {
      console.log('Skipped usePendingOrdersSocket', providerId);
    }
    return () => {
      if (socket) {
        const channel = redisKeys.pendingOrders(providerId);
        console.log('[socket] unsub', channel);
        socket.off(channel);
        socket.emit('leave', channel);
      }
    };
  }, [socket, providerId]);
}

interface OrdersWatchProps {
  providerId: string;
}

function OrdersWatch({ providerId }: OrdersWatchProps) {
  useEffect(() => {
    orderGetMany({ providerId, reload: true }).then((res) => {
      const orderIds = [...res.orders, ...res.positions].map((item) => item._id);
      if (!orderIds.length) return;
      orderGetManyInfo({ providerId, orderIds });
    });
    orderGetIdea({ providerId, reload: true });
  }, [providerId]);

  useQuery({
    queryFn: () => orderGetMany({ providerId, orderStatus: OrderStatus.live }).then((res) => {
      const orderIds = res.positions.map((item) => item._id);
      if (!orderIds.length) return [];
      return orderGetManyInfo({ providerId, orderIds });
    }),
    queryKey: queryKeys.orders(`${providerId}-${OrderStatus.live}`),
    refetchInterval: refreshMS,
  });

  useQuery({
    queryFn: () => orderGetMany({ providerId, orderStatus: OrderStatus.pending }).then((res) => {
      const orderIds = res.orders.map((item) => item._id);
      if (!orderIds.length) return [];
      return orderGetManyInfo({ providerId, orderIds });
    }),
    queryKey: queryKeys.orders(`${providerId}-${OrderStatus.pending}`),
    refetchInterval: refreshMS,
  });

  useLiveOrdersSocket(providerId);
  // useLiveOrdersSdb(providerId);

  usePendingOrdersSocket(providerId);
  // usePendingOrdersSdb(providerId);

  return null;
}

export default OrdersWatch;
