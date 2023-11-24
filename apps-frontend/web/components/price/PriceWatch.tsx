import { AccountType, getMajorPairs } from '@fishprovider/core';
import priceGetMany from '@fishprovider/cross/dist/api/prices/getMany';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import storeOrders from '@fishprovider/cross/dist/stores/orders';
import storePrices from '@fishprovider/cross/dist/stores/prices';
import type { OrderStatus } from '@fishprovider/utils/dist/constants/order';
import { redisKeys } from '@fishprovider/utils/dist/constants/redis';
import type { Price } from '@fishprovider/utils/dist/types/Price.model';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';

import { watchUserInfoController } from '~controllers/user.controller';
import { refreshMS } from '~utils';

const usePricesSocket = (accountType: AccountType, watchSymbols: string[]) => {
  const socket = watchUserInfoController((state) => state.socket);

  const [symbols, setSymbols] = useState(watchSymbols);

  useEffect(() => {
    if (watchSymbols.length !== symbols.length || _.difference(watchSymbols, symbols).length) {
      setSymbols(watchSymbols);
    }
  }, [watchSymbols, symbols]);

  const prevChannels = useRef<string[]>();
  useEffect(() => {
    prevChannels.current = symbols.map(((symbol) => redisKeys.price(accountType as any, symbol)));
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
        const channel = redisKeys.price(accountType as any, symbol);
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
          const channel = redisKeys.price(accountType as any, symbol);
          Logger.debug('[socket] unsub from unmount', channel);
          socket.off(channel);
          socket.emit('leave', channel);
        });
      }
    };
  }, [socket, accountType, symbols]);
};

interface PriceWatchProps {
  accountId: string;
  accountType: AccountType;
  activeSymbol: string;
  orderStatuses: OrderStatus[];
}

function PriceWatch({
  accountId, accountType, activeSymbol, orderStatuses,
}: PriceWatchProps) {
  const orders = storeOrders.useStore((state) => _.filter(
    state,
    (item) => item.providerId === accountId && orderStatuses.includes(item.status),
  ));

  const symbols = _.sortBy(_.uniq([
    ...getMajorPairs(accountType),
    ...orders.map((item) => item.symbol),
    activeSymbol,
  ]));

  useEffect(() => {
    priceGetMany({ providerType: accountType as any, symbols, reload: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbols.length]);

  useQuery({
    queryFn: () => priceGetMany({ providerType: accountType as any, symbols }),
    queryKey: queryKeys.prices(accountType as any, ...symbols),
    enabled: !!symbols.length,
    refetchInterval: refreshMS,
  });

  usePricesSocket(accountType, symbols);

  return null;
}

export default PriceWatch;
