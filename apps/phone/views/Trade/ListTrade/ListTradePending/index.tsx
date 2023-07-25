import storePrices from '@fishprovider/cross/dist/stores/prices';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { ProviderType } from '@fishprovider/utils/dist/constants/account';
import { getEntry } from '@fishprovider/utils/dist/helpers/order';
import { getDiffPips, getMajorPairs } from '@fishprovider/utils/dist/helpers/price';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import _ from 'lodash';
import { useState } from 'react';

import H6 from '~ui/H6';
import Stack from '~ui/Stack';
import Text from '~ui/Text';

import ItemTradePending from './ItemTradePending';

interface Props {
  orders: Order[];
}

function ListTradePending({ orders }: Props) {
  const {
    providerType = ProviderType.icmarkets,
  } = storeUser.useStore((state) => ({
    providerType: state.activeProvider?.providerType,
  }));

  const symbols = _.uniq([
    ...getMajorPairs(providerType),
    ...orders.map((item) => item.symbol),
  ]);

  const prices = storePrices.useStore((state) => (
    _.pickBy(
      state,
      (item) => item.providerType === providerType && symbols.includes(item.symbol),
    )
  ));

  const [sortDistance] = useState(true);

  const renderBody = () => {
    if (!orders.length) {
      return (
        <Text>N.A.</Text>
      );
    }

    let viewOrders = orders;

    viewOrders = viewOrders.map((item) => {
      const { symbol } = item;
      const priceDoc = prices[`${providerType}-${symbol}`];
      const entry = getEntry(item);

      if (!priceDoc || !entry) return item;

      const distance = Math.abs(getDiffPips({
        providerType,
        symbol,
        prices,
        entry,
        price: priceDoc.last,
      }).pips || 0);
      return {
        ...item,
        distance,
      };
    });

    viewOrders = _.orderBy(
      viewOrders,
      ['distance'],
      [sortDistance ? 'asc' : 'desc'],
    );

    return viewOrders.map((order) => (
      <ItemTradePending
        key={order._id}
        order={order}
        prices={prices}
      />
    ));
  };

  return (
    <Stack>
      <H6>Pending Orders</H6>
      {renderBody()}
    </Stack>
  );
}

export default ListTradePending;
