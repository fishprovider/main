import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import storePrices from '@fishprovider/cross/dist/stores/prices';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';
import { getEntry, parseCopyId } from '@fishprovider/utils/dist/helpers/order';
import { getDiffPips, getLotFromVolume } from '@fishprovider/utils/dist/helpers/price';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import _ from 'lodash';
import moment from 'moment';

import BuySellIcon from '~components/order/BuySellIcon';
import useConversionRate from '~hooks/useConversionRate';
import Accordion from '~ui/core/Accordion';
import Box from '~ui/core/Box';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Text from '~ui/core/Text';
import { getSLTPAmt } from '~utils/price';

interface Props {
  order: Order;
  mergedView?: boolean;
}

function OrderInfo({ order, mergedView }: Props) {
  const {
    asset = 'USD',
  } = storeUser.useStore((state) => ({
    asset: state.activeProvider?.asset,
  }));
  const priceDoc = storePrices.useStore((prices) => prices[`${order.providerType}-${order.symbol}`]);

  const { parentId = '' } = order.copyId ? parseCopyId(order.copyId) : {};

  const { parentIcon } = storeAccounts.useStore((state) => ({
    parentIcon: state[parentId]?.icon,
  }));

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
    `${order.volume} ${order.symbol}`,
    ...(isClosed ? [
      `Entry ${entry}`,
      `Close ${order.priceClose}`,
    ] : [
      `Entry ${entry}`,
    ]),
  ].join(', ');

  const stopLoss = [
    ...(isClosed ? [
      `SL ${order.stopLoss || '- 🔥🔥🔥'}`,
    ] : [
      ...(order.stopLoss ? [`SL ${order.stopLoss} (${_.round(stopLossPips || 0, 2)} pips) ${stopLossAmtAsset}`] : ['SL - 🔥🔥🔥']),
    ]),
  ].join(', ');

  const takeProfit = [
    ...(isClosed ? [
      `TP ${order.takeProfit || '-'}`,
    ] : [
      ...(order.takeProfit ? [`TP ${order.takeProfit} (${_.round(takeProfitPips || 0, 2)} pips) ${takeProfitAmtAsset}`] : ['TP -']),
    ]),
  ].join(', ');

  const lines = mergedView ? [base] : [base, stopLoss, takeProfit];

  const details = [
    `ID ${order._id}`,
    ...(order.positionId ? [`PID ${order.positionId}`] : []),
    ...(order.label ? [`Label [${order.label}]`] : []),
    ...(order.comment ? [`Comment [${order.comment}]`] : []),
    `Created at ${moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}`,
    `Updated at ${moment(order.updatedAt).format('YYYY-MM-DD HH:mm:ss')}`,
    `Active in ${moment(order.createdAt).fromNow(true)}`,
  ];

  const getParentIcon = () => {
    if (!order.copyId) return null;
    return parentIcon || <Icon name="Cyclone" button tooltip="Copying" color="orange" />;
  };

  const renderMain = () => (
    <Group
      spacing={0}
      onClick={() => {
        storeUser.mergeState({ activeSymbol: order.symbol });
      }}
    >
      {getParentIcon()}
      <BuySellIcon direction={order.direction} />
      <Box>{lines.map((line, index) => <Text size="sm" key={index}>{line}</Text>)}</Box>
    </Group>
  );

  if (mergedView) return renderMain();

  return (
    <Accordion variant="filled">
      <Accordion.Item value="order">
        <Accordion.Control p={0}>
          {renderMain()}
        </Accordion.Control>
        <Accordion.Panel>
          {details.map((line, index) => <Text key={index}>{line}</Text>)}
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

export default OrderInfo;
