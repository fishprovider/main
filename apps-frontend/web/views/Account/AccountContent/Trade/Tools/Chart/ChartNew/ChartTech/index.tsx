import { AccountType, getMajorPairs } from '@fishprovider/core';
import barGetMany from '@fishprovider/cross/dist/api/bars/getMany';
import orderRemove from '@fishprovider/cross/dist/api/orders/remove';
import orderUpdate from '@fishprovider/cross/dist/api/orders/update';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import storeBars from '@fishprovider/cross/dist/stores/bars';
import storeOrders from '@fishprovider/cross/dist/stores/orders';
import storePrices from '@fishprovider/cross/dist/stores/prices';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';
import { validateOrderRemove, validateOrderUpdate } from '@fishprovider/utils/dist/helpers/validateOrder';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import _ from 'lodash';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

import OrderModal from '~components/order/OpenOrder/OrderModal';
import SymbolsSelect from '~components/price/SymbolsSelect';
import { getUserInfoController, watchUserInfoController } from '~controllers/user.controller';
import useConversionRate from '~hooks/useConversionRate';
import Box from '~ui/core/Box';
import Button from '~ui/core/Button';
import Group from '~ui/core/Group';
import Skeleton from '~ui/core/Skeleton';
import Stack from '~ui/core/Stack';
import openConfirmModal from '~ui/modals/openConfirmModal';
import openModal from '~ui/modals/openModal';
import { toastError } from '~ui/toast';

const FinChart = dynamic(() => import('./FinChart'), {
  loading: () => <Skeleton height={400} />,
  ssr: false,
});

const barCounts: Record<string, Record<string, Record<number, number>>> = {};

const periods = ['M5', 'M15', 'H1', 'H4', 'D1', 'W1', 'MN1'];

interface Props {
  fullscreenAction?: React.ReactNode,
}

function ChartTech({ fullscreenAction }: Props) {
  const {
    providerId,
    symbol = 'AUDUSD',
    accountType = AccountType.icmarkets,
    asset = 'USD',
  } = watchUserInfoController((state) => ({
    providerId: state.activeAccount?._id,
    accountType: state.activeAccount?.accountType,
    symbol: state.activeSymbol,
    asset: state.activeAccount?.asset,
  }));
  const orders = storeOrders.useStore((state) => _.filter(
    state,
    (item) => item.providerId === providerId
      && [OrderStatus.live, OrderStatus.pending].includes(item.status),
  ));

  const symbols = _.uniq([
    ...getMajorPairs(accountType),
    ...orders.map((item) => item.symbol),
  ]);

  const prices = storePrices.useStore((state) => _.pickBy(
    state,
    (item) => item.providerType === accountType as any && symbols.includes(item.symbol),
  ));
  const priceDoc = prices[`${accountType}-${symbol}`];

  const rate = useConversionRate(symbol);

  const [period, setPeriod] = useState('H1');
  const [scale, setScale] = useState(1);

  const bars = storeBars.useStore((state) => _.filter(
    state,
    (item) => item.providerType === accountType as any
      && item.symbol === symbol && item.period === period,
  ));

  useEffect(() => {
    setScale(1);
  }, [accountType, symbol, period]);

  useQuery({
    queryFn: () => barGetMany({
      providerType: accountType as any, symbol, period, scale,
    }),
    queryKey: queryKeys.bars(accountType as any, symbol, period, scale),
  });

  if (!priceDoc) return <Skeleton height={400} />;

  const data = _.sortBy(
    bars.map((item) => ({
      ...item,
      date: new Date(item.startAt),
    })),
    'date',
  );
  _.set(data, [data.length - 1, 'close'], priceDoc.last);

  _.set(barCounts, [symbol, period, scale], data.length);

  const onLoadMore = () => {
    if (
      barCounts[symbol]?.[period]?.[scale]
      && barCounts[symbol]?.[period]?.[scale + 1] === undefined
    ) {
      _.set(barCounts, [symbol, period, scale + 1], 0);
      setScale((prev) => prev + 1);
    }
  };

  const validateUpdate = (orderToUpdate: Order) => {
    const {
      activeUser: user,
      activeAccount: account,
    } = getUserInfoController();

    const liveOrders = _.filter(
      storeOrders.getState(),
      (item) => item.providerId === account?._id && item.status === OrderStatus.live,
    );
    const pendingOrders = _.filter(
      storeOrders.getState(),
      (item) => item.providerId === account?._id && item.status === OrderStatus.pending,
    );

    return validateOrderUpdate({
      user: user as any,
      account: account as any,
      liveOrders,
      pendingOrders,
      orderToUpdate,
      prices: storePrices.getState(),
    });
  };

  const onUpdateOrder = async (orderId: string, options: {
    stopLoss?: number,
    takeProfit?: number,
    limitPrice?: number,
    stopPrice?: number,
  }) => {
    const order = orders.find((item) => item._id === orderId) as Order;

    const { error } = validateUpdate({ ...order, ...options });
    if (error) {
      toastError(error);
      return;
    }

    if (!(await openConfirmModal())) return;

    await orderUpdate({
      order,
      options: {
        ...options,
        volume: order.volume,
        stopLoss: options.stopLoss || order.stopLoss || undefined,
        takeProfit: options.takeProfit || order.takeProfit || undefined,
        limitPrice: options.limitPrice || order.limitPrice,
        stopPrice: options.stopPrice || order.stopPrice,
      },
    });
  };

  const validateRemove = (orderToRemove: Order) => {
    const {
      activeUser: user,
      activeAccount: account,
    } = getUserInfoController();

    return validateOrderRemove({
      user: user as any,
      account: account as any,
      orderToRemove,
      prices: storePrices.getState(),
    });
  };

  const onRemoveOrder = async (orderId: string) => {
    const order = orders.find((item) => item._id === orderId) as Order;

    const { error } = validateRemove(order);
    if (error) {
      toastError(error);
      return;
    }

    if (!(await openConfirmModal())) return;

    orderRemove({ order });
  };

  const onAddOrder = () => openModal({
    title: 'Open Order',
    content: <OrderModal />,
  });

  const renderToolbar = () => (
    <Group position="center">
      <SymbolsSelect hidePriceView />
      <Group spacing={0}>
        {periods.map((item) => (
          <Button
            key={item}
            variant={period === item ? 'filled' : 'light'}
            onClick={() => setPeriod(item)}
            size="sm"
          >
            {item}
          </Button>
        ))}
      </Group>
      {fullscreenAction}
    </Group>
  );

  const renderChart = () => {
    if (!data.length) return <Skeleton height={400} />;
    return (
      <Box bg="white" h="100%">
        <FinChart
          data={data}
          srTimeFrs={[]}
          asset={asset}
          providerType={accountType}
          priceDoc={priceDoc}
          prices={prices}
          rate={rate}
          orders={orders}
          onAddOrder={onAddOrder}
          onRemoveOrder={onRemoveOrder}
          onUpdateOrder={onUpdateOrder}
          onLoadMore={onLoadMore}
        />
      </Box>
    );
  };

  return (
    <Stack h="100%">
      {renderToolbar()}
      {renderChart()}
    </Stack>
  );
}

export default ChartTech;
