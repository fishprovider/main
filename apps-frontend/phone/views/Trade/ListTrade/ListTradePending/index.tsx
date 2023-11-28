import { FontAwesome } from '@expo/vector-icons';
import { ProviderType } from '@fishprovider/core';
import orderGetMany from '@fishprovider/cross/dist/api/orders/getMany';
import orderGetManyInfo from '@fishprovider/cross/dist/api/orders/getManyInfo';
import { useMutate } from '@fishprovider/cross/dist/libs/query';
import storePrices from '@fishprovider/cross/dist/stores/prices';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';
import { getEntry } from '@fishprovider/utils/dist/helpers/order';
import { getDiffPips, getMajorPairs } from '@fishprovider/utils/dist/helpers/price';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import _ from 'lodash';
import { useState } from 'react';

import { watchUserInfoController } from '~controllers/user.controller';
import Group from '~ui/Group';
import H4 from '~ui/H4';
import Stack from '~ui/Stack';
import Text from '~ui/Text';

import ItemTradePending from './ItemTradePending';

interface Props {
  orders: Order[];
}

function ListTradePending({ orders }: Props) {
  const {
    providerId = '',
    providerType = ProviderType.icmarkets,
  } = watchUserInfoController((state) => ({
    providerId: state.activeAccount?._id,
    providerType: state.activeAccount?.providerType,
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

  const { mutate: reload, isLoading: isLoadingReload } = useMutate({
    mutationFn: orderGetMany,
  });

  const [sortDistance] = useState(true);

  const onReload = () => {
    if (isLoadingReload) return;

    reload({
      providerId,
      orderStatus: OrderStatus.pending,
      reload: true,
    }, {
      onSuccess: (res) => {
        const orderIds = res.positions.map((item) => item._id);
        if (!orderIds.length) return;
        orderGetManyInfo({ providerId, orderIds, fields: [] });
      },
    });
  };

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
      <Group space="$3">
        <H4>Pending Orders</H4>
        <FontAwesome
          name="refresh"
          size={20}
          onPress={onReload}
          color={isLoadingReload ? 'gray' : 'deepskyblue'}
        />
      </Group>
      {renderBody()}
    </Stack>
  );
}

export default ListTradePending;
