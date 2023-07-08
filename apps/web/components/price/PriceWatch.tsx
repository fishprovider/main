import priceGetMany from '@fishprovider/cross/api/prices/getMany';
import { useQuery } from '@fishprovider/cross/libs/query';
import storeOrders from '@fishprovider/cross/stores/orders';
import type { ProviderType } from '@fishprovider/utils/constants/account';
import type { OrderStatus } from '@fishprovider/utils/constants/order';
import { getMajorPairs } from '@fishprovider/utils/helpers/price';
import _ from 'lodash';
import { useEffect } from 'react';

import { queryKeys } from '~constants/query';
import useWatchPrices from '~hooks/useWatchPrices';
import { refreshMS } from '~utils';

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

  useWatchPrices(providerType, symbols);

  return null;
}

export default PriceWatch;
