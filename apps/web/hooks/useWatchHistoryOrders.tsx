import storeOrders from '@fishprovider/cross/stores/orders';
import storeUser from '@fishprovider/cross/stores/user';
import { redisKeys } from '@fishprovider/utils/constants/redis';
import type { Order } from '@fishprovider/utils/types/Order.model';
import { useEffect, useRef } from 'react';

const getChannel = redisKeys.historyOrders;

function useWatchHistoryOrders(providerId: string) {
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
      Logger.debug('Skipped useWatchHistoryOrders', providerId);
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

export default useWatchHistoryOrders;
