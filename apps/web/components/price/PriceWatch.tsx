import priceGetMany from '@fishprovider/cross/dist/api/prices/getMany';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import storeOrders from '@fishprovider/cross/dist/stores/orders';
import storePrices from '@fishprovider/cross/dist/stores/prices';
import storeUser from '@fishprovider/cross/dist/stores/user';
import type { ProviderType } from '@fishprovider/utils/dist/constants/account';
import type { OrderStatus } from '@fishprovider/utils/dist/constants/order';
import { redisKeys } from '@fishprovider/utils/dist/constants/redis';
import { getMajorPairs } from '@fishprovider/utils/dist/helpers/price';
import type { Price } from '@fishprovider/utils/dist/types/Price.model';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';

import { queryKeys } from '~constants/query';
import { refreshMS } from '~utils';

const usePricesSocket = (providerType: ProviderType, watchSymbols: string[]) => {
  const socket = storeUser.useStore((state) => state.socket);

  const [symbols, setSymbols] = useState(watchSymbols);

  useEffect(() => {
    if (watchSymbols.length !== symbols.length || _.difference(watchSymbols, symbols).length) {
      setSymbols(watchSymbols);
    }
  }, [watchSymbols, symbols]);

  const prevChannels = useRef<string[]>();
  useEffect(() => {
    prevChannels.current = symbols.map(((symbol) => redisKeys.price(providerType, symbol)));
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
        const channel = redisKeys.price(providerType, symbol);
        Logger.debug('[socket] sub', channel);
        socket.emit('join', channel);
        socket.on(channel, (doc: Price) => {
          storePrices.mergeDoc(doc, { skipLog: true });
        });
      });
    } else {
      Logger.debug('Skipped usePricesSocket');
    }

    return () => {
      if (socket) {
        symbols.forEach((symbol) => {
          const channel = redisKeys.price(providerType, symbol);
          Logger.debug('[socket] unsub from unmount', channel);
          socket.off(channel);
          socket.emit('leave', channel);
        });
      }
    };
  }, [socket, providerType, symbols]);
};

interface PriceWatchProps {
  providerId: string;
  providerType: ProviderType;
  activeSymbol: string;
  orderStatuses: OrderStatus[];
}

function PriceWatch({
  providerId, providerType, activeSymbol, orderStatuses,
}: PriceWatchProps) {
  const orders = storeOrders.useStore((state) => _.filter(
    state,
    (item) => item.providerId === providerId && orderStatuses.includes(item.status),
  ));

  const symbols = _.sortBy(_.uniq([
    ...getMajorPairs(providerType),
    ...orders.map((item) => item.symbol),
    activeSymbol,
  ]));

  useEffect(() => {
    priceGetMany({ providerType, symbols, reload: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbols.length]);

  useQuery({
    queryFn: () => priceGetMany({ providerType, symbols }),
    queryKey: queryKeys.prices(providerType, ...symbols),
    enabled: !!symbols.length,
    refetchInterval: refreshMS,
  });

  usePricesSocket(providerType, symbols);

  return null;
}

export default PriceWatch;
