import { FontAwesome } from '@expo/vector-icons';
import { ProviderType } from '@fishprovider/core';
import orderGetMany from '@fishprovider/cross/dist/api/orders/getMany';
import orderGetManyInfo from '@fishprovider/cross/dist/api/orders/getManyInfo';
import { useMutate } from '@fishprovider/cross/dist/libs/query';
import storePrices from '@fishprovider/cross/dist/stores/prices';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';
import { getProfit } from '@fishprovider/utils/dist/helpers/order';
import { getMajorPairs } from '@fishprovider/utils/dist/helpers/price';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import _ from 'lodash';
import { useState } from 'react';

import { watchUserInfoController } from '~controllers/user.controller';
import Group from '~ui/Group';
import H4 from '~ui/H4';
import Stack from '~ui/Stack';
import Text from '~ui/Text';

import ItemTradeLive from './ItemTradeLive';

interface Props {
  orders: Order[];
}

function ListTradeLive({ orders }: Props) {
  const {
    providerId = '',
    providerType = ProviderType.icmarkets,
    asset = 'USD',
  } = watchUserInfoController((state) => ({
    providerId: state.activeAccount?._id,
    providerType: state.activeAccount?.providerType,
    asset: state.activeAccount?.asset,
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

  const [mergedViewInput, setMergedViewInput] = useState<boolean>();
  const mergedView = mergedViewInput ?? orders.length > 5;

  const [sortProfit] = useState(false);

  const onReload = () => {
    if (isLoadingReload) return;

    reload({
      providerId,
      orderStatus: OrderStatus.live,
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

    if (mergedView) {
      const groupSymbolOrders = _.groupBy(orders, (item) => item.symbol);
      const mergedOrders = _.flatMap(groupSymbolOrders, (symbolOrders, symbol) => {
        const digits = storePrices.getState()[`${providerType}-${symbol}`]?.digits;
        const directionOrders = _.groupBy(symbolOrders, (item) => item.direction);
        return _.map(directionOrders, (items) => {
          let entry: number | undefined;
          let volume = 0;
          _.forEach(items, (item) => {
            if (item.price) {
              entry = entry === undefined
                ? item.price
                : (entry * volume + item.price * item.volume) / (volume + item.volume);
            }
            volume += item.volume;
          });
          return {
            ...items[0] as Order,
            _id: `${items[0]?._id}-merged`,
            volume,
            price: _.round(entry ?? 0, digits),
          };
        });
      });

      viewOrders = mergedOrders;
    }

    viewOrders = viewOrders.map((item) => {
      const profit = getProfit([item], prices, asset);
      return {
        ...item,
        profit,
      };
    });

    viewOrders = _.orderBy(
      viewOrders,
      ['profit'],
      [sortProfit ? 'asc' : 'desc'],
    );

    return viewOrders.map((order) => (
      <ItemTradeLive
        key={order._id}
        order={order}
        prices={prices}
        mergedView={mergedView}
        unmergeView={() => setMergedViewInput(
          (prev) => (prev === undefined ? !mergedView : !prev),
        )}
      />
    ));
  };

  return (
    <Stack>
      <Group space="$3">
        <H4>Live Orders</H4>
        <FontAwesome
          name="refresh"
          size={20}
          onPress={onReload}
          color={isLoadingReload ? 'gray' : 'deepskyblue'}
        />
        <FontAwesome
          name={mergedView ? 'expand' : 'compress'}
          size={20}
          onPress={() => setMergedViewInput(
            (prev) => (prev === undefined ? !mergedView : !prev),
          )}
        />
      </Group>
      {renderBody()}
    </Stack>
  );
}

export default ListTradeLive;
