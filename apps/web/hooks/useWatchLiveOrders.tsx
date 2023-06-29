import storeOrders from '@fishbot/cross/stores/orders';
import storeUser from '@fishbot/cross/stores/user';
import { redisKeys } from '@fishbot/utils/constants/redis';
import type { Order } from '@fishbot/utils/types/Order.model';
import { useEffect, useRef } from 'react';

import { subDoc } from '~libs/sdb';

const getChannel = redisKeys.liveOrders;

function useWatchLiveOrders(providerId: string) {
  const { isClientLoggedIn, socket } = storeUser.useStore((state) => ({
    isClientLoggedIn: state.isClientLoggedIn,
    socket: state.socket,
  }));

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
      Logger.debug('Skipped useWatchLiveOrders', providerId);
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

  useEffect(() => {
    if (isClientLoggedIn) {
      Logger.debug('[firestore] sub', `liveOrders/${providerId}`);
      const unsub = subDoc<{ orders: Order[] }>({
        doc: `liveOrders/${providerId}`,
        onSnapshot: (doc) => {
          storeOrders.mergeDocs(doc.orders);
        },
      });
      return unsub;
    }
    return () => undefined;
  }, [isClientLoggedIn, providerId]);
}

export default useWatchLiveOrders;
