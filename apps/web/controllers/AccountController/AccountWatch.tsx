import accountGet from '@fishprovider/cross/dist/api/accounts/get';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { redisKeys } from '@fishprovider/utils/dist/constants/redis';
import type { Account } from '@fishprovider/utils/dist/types/Account.model';
import { useEffect, useRef } from 'react';

import { queryKeys } from '~constants/query';
import { subNotif, unsubNotif } from '~libs/pushNotif';
import { subDoc } from '~libs/sdb';
import { refreshMS } from '~utils';

function useAccountSocket(providerId: string) {
  const socket = storeUser.useStore((state) => state.socket);

  const prevChannel = useRef<string>();
  useEffect(() => {
    prevChannel.current = redisKeys.account(providerId);
  });

  useEffect(() => {
    if (socket) {
      if (prevChannel.current) {
        Logger.debug('[socket] unsub from prev', prevChannel.current);
        socket.off(prevChannel.current);
        socket.emit('leave', prevChannel.current);
      }

      const channel = redisKeys.account(providerId);
      Logger.debug('[socket] sub', channel);
      socket.emit('join', channel);
      socket.on(channel, (doc: Account) => {
        storeAccounts.mergeDoc(doc);
      });
    } else {
      Logger.debug('Skipped useAccountSocket', providerId);
    }
    return () => {
      if (socket) {
        const channel = redisKeys.account(providerId);
        Logger.debug('[socket] unsub', channel);
        socket.off(channel);
        socket.emit('leave', channel);
      }
    };
  }, [socket, providerId]);
}

function useAccountSdb(providerId: string) {
  const isClientLoggedIn = storeUser.useStore((state) => state.isClientLoggedIn);

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

function useAccountNotif(providerId: string) {
  const {
    isServerLoggedIn,
    isStar,
  } = storeUser.useStore((state) => ({
    isServerLoggedIn: state.isServerLoggedIn,
    isStar: state.info?.starProviders?.[providerId],
  }));

  useEffect(() => {
    if (isServerLoggedIn) {
      if (isStar) {
        Logger.debug('[notif] subNotif', providerId);
        subNotif(providerId);
      } else {
        Logger.debug('[notif] unsubNotif', providerId);
        unsubNotif(providerId);
      }
    }
    return () => undefined;
  }, [isServerLoggedIn, isStar, providerId]);
}

interface Props {
  providerId: string;
}

function AccountWatch({ providerId }: Props) {
  useEffect(() => {
    accountGet({ providerId, reload: true });
  }, [providerId]);

  useQuery({
    queryFn: () => accountGet({ providerId }),
    queryKey: queryKeys.account(providerId),
    refetchInterval: refreshMS,
  });

  useAccountSocket(providerId);
  useAccountSdb(providerId);

  useAccountNotif(providerId);

  return null;
}

export default AccountWatch;
