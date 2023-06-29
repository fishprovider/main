import storeAccounts from '@fishbot/cross/stores/accounts';
import storeUser from '@fishbot/cross/stores/user';
import { redisKeys } from '@fishbot/utils/constants/redis';
import type { Account } from '@fishbot/utils/types/Account.model';
import { useEffect, useRef } from 'react';

import { subDoc } from '~libs/sdb';

const getChannel = redisKeys.account;

function useWatchAccount(providerId: string) {
  const {
    isClientLoggedIn,
    socket,
  } = storeUser.useStore((state) => ({
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
      socket.on(channel, (doc: Account) => {
        storeAccounts.mergeDoc(doc);
      });
    } else {
      Logger.debug('Skipped useWatchAccount', providerId);
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
      Logger.debug('[firestore] sub', `account/${providerId}`);
      const unsub = subDoc<Account>({
        doc: `account/${providerId}`,
        onSnapshot: storeAccounts.mergeDoc,
      });
      return unsub;
    }
    return () => undefined;
  }, [isClientLoggedIn, providerId]);
}

export default useWatchAccount;
