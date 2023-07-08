import storePrices from '@fishprovider/cross/stores/prices';
import storeUser from '@fishprovider/cross/stores/user';
import type { ProviderType } from '@fishprovider/utils/constants/account';
import { redisKeys } from '@fishprovider/utils/constants/redis';
import type { Price } from '@fishprovider/utils/types/Price.model';
import { useEffect, useRef } from 'react';

import useSymbols from '~hooks/useSymbols';

const getChannel = redisKeys.price;

const useWatchPrices = (providerType: ProviderType, watchSymbols: string[]) => {
  const socket = storeUser.useStore((state) => state.socket);

  const symbols = useSymbols(watchSymbols);

  const prevChannels = useRef<string[]>();
  useEffect(() => {
    prevChannels.current = symbols.map(((symbol) => getChannel(providerType, symbol)));
  });

  useEffect(() => {
    if (socket) {
      if (prevChannels.current) {
        prevChannels.current.forEach((channel) => {
          Logger.debug('[socket] unsub from prev', channel);
          socket.off(channel);
          socket.emit('leave', channel);
        });
      }

      symbols.forEach((symbol) => {
        const channel = getChannel(providerType, symbol);
        Logger.debug('[socket] sub', channel);
        socket.emit('join', channel);
        socket.on(channel, (doc: Price) => {
          storePrices.mergeDoc(doc, { skipLog: true });
        });
      });
    } else {
      Logger.debug('Skipped useWatchPrices');
    }

    return () => {
      if (socket) {
        symbols.forEach((symbol) => {
          const channel = getChannel(providerType, symbol);
          Logger.debug('[socket] unsub from unmount', channel);
          socket.off(channel);
          socket.emit('leave', channel);
        });
      }
    };
  }, [socket, providerType, symbols]);
};

export default useWatchPrices;
