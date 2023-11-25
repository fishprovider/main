import { Account } from '@fishprovider/core';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import { redisKeys } from '@fishprovider/utils/dist/constants/redis';
import { useEffect, useRef } from 'react';

import { getAccountController, updateAccountController } from '~controllers/account.controller';
import { watchUserInfoController } from '~controllers/user.controller';
import { subNotif, unsubNotif } from '~libs/pushNotif';
import { subDoc } from '~libs/sdb';
import { refreshMS } from '~utils';

function useAccountSocket(providerId: string) {
  const socket = watchUserInfoController((state) => state.socket);

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
      socket.on(channel, (doc: Partial<Account>) => {
        updateAccountController({ accountId: providerId }, { account: doc });
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
  const isClientLoggedIn = watchUserInfoController((state) => state.isClientLoggedIn);

  useEffect(() => {
    if (isClientLoggedIn) {
      Logger.debug('[firestore] sub', `account/${providerId}`);
      const unsub = subDoc<Account>({
        doc: `account/${providerId}`,
        onSnapshot: (account) => updateAccountController({ accountId: providerId }, { account }),
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
  } = watchUserInfoController((state) => ({
    isServerLoggedIn: state.isServerLoggedIn,
    isStar: state.activeUser?.starAccounts?.[providerId],
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
    getAccountController({ accountId: providerId, getTradeInfo: true });
  }, [providerId]);

  useQuery({
    queryFn: () => getAccountController({ accountId: providerId }),
    queryKey: queryKeys.account(providerId),
    refetchInterval: refreshMS,
  });

  useAccountSocket(providerId);
  useAccountSdb(providerId);

  useAccountNotif(providerId);

  return null;
}

export default AccountWatch;
