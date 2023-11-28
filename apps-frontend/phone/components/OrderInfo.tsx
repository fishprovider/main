import storePrices from '@fishprovider/cross/dist/stores/prices';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';
import { getEntry } from '@fishprovider/utils/dist/helpers/order';
import { getDiffPips, getLotFromVolume } from '@fishprovider/utils/dist/helpers/price';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import _ from 'lodash';

import { watchUserInfoController } from '~controllers/user.controller';
import useConversionRate from '~hooks/useConversionRate';
import Stack from '~ui/Stack';
import Text from '~ui/Text';
import { getSLTPAmt } from '~utils/price';

interface Props {
  order: Order;
  mergedView?: boolean;
}

function OrderInfo({ order, mergedView }: Props) {
  const {
    asset = 'USD',
  } = watchUserInfoController((state) => ({
    asset: state.activeAccount?.asset,
  }));
  const priceDoc = storePrices.useStore((prices) => prices[`${order.providerType}-${order.symbol}`]);

  const rate = useConversionRate(order.symbol);

  const isClosed = order.status === OrderStatus.closed;
  const entry = getEntry(order);

  if (!priceDoc || !entry) return null;

  const lots = getLotFromVolume({
    providerType: order.providerType,
    symbol: order.symbol,
    prices: { [priceDoc._id]: priceDoc },
    volume: order.volume,
  }).lot;

  const stopLossPips = order.stopLoss && getDiffPips({
    providerType: order.providerType,
    symbol: order.symbol,
    prices: { [priceDoc._id]: priceDoc },
    entry,
    price: order.stopLoss,
  }).pips;

  const takeProfitPips = order.takeProfit && getDiffPips({
    providerType: order.providerType,
    symbol: order.symbol,
    prices: { [priceDoc._id]: priceDoc },
    entry,
    price: order.takeProfit,
  }).pips;

  const {
    stopLossAmtAsset,
    takeProfitAmtAsset,
  } = getSLTPAmt({
    direction: order.direction,
    volume: order.volume,
    entry,
    stopLoss: order.stopLoss || undefined,
    takeProfit: order.takeProfit || undefined,
    asset,
    rate,
  });

  const base = [
    ...(lots ? [`${lots} Lot`] : []),
    order.symbol,
    ...(isClosed ? [
      `Entry ${entry}`,
      `Close ${order.priceClose}`,
    ] : [
      `at ${entry}`,
    ]),
  ].join(' ');

  const stopLoss = [
    ...(isClosed ? [
      `SL ${order.stopLoss || '- 🔥🔥🔥'}`,
    ] : [
      ...(order.stopLoss ? [`SL ${order.stopLoss} (${_.round(stopLossPips || 0, 2)} pips) ${stopLossAmtAsset}`] : ['SL - 🔥🔥🔥']),
    ]),
  ].join(' ');

  const takeProfit = [
    ...(isClosed ? [
      `TP ${order.takeProfit || '-'}`,
    ] : [
      ...(order.takeProfit ? [`TP ${order.takeProfit} (${_.round(takeProfitPips || 0, 2)} pips) ${takeProfitAmtAsset}`] : ['TP -']),
    ]),
  ].join(' ');

  const lines = mergedView ? [base] : [base, stopLoss, takeProfit];

  return (
    <Stack>
      {lines.map((line, index) => <Text key={index}>{line}</Text>)}
    </Stack>
  );
}

export default OrderInfo;
