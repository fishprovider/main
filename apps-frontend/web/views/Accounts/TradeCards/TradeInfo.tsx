import { forexMajorPairs, ProviderType } from '@fishprovider/core';
import orderGetMany from '@fishprovider/cross/dist/api/orders/getMany';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import storeOrders from '@fishprovider/cross/dist/stores/orders';
import storePrices from '@fishprovider/cross/dist/stores/prices';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';
import { getEntry, getProfit, getProfitIcon } from '@fishprovider/utils/dist/helpers/order';
import { getDiffPips, getLotFromVolume } from '@fishprovider/utils/dist/helpers/price';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import _ from 'lodash';

import TargetProgress from '~components/account/EquityProgress/TargetProgress';
import BuySellIcon from '~components/order/BuySellIcon';
import { watchAccountController } from '~controllers/account.controller';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Indicator from '~ui/core/Indicator';
import Popover from '~ui/core/Popover';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import { refreshMS } from '~utils';
import { getAccountStats } from '~utils/account';

interface Props {
  providerId: string,
}

function TradeInfo({
  providerId,
}: Props) {
  const {
    providerType = ProviderType.icmarkets,
    balance = 0,
    marginRaw = 0,
    asset = 'USD',
  } = watchAccountController((state) => ({
    providerType: state[providerId]?.providerType,
    balance: state[providerId]?.balance,
    marginRaw: state[providerId]?.margin,
    asset: state[providerId]?.asset,
  }));

  const orders = storeOrders.useStore((state) => _.filter(
    state,
    (item) => item.providerId === providerId
      && [OrderStatus.live, OrderStatus.pending].includes(item.status),
  ));

  const symbols = _.uniq([
    ...forexMajorPairs,
    ...orders.map((order) => order.symbol),
  ]);

  const prices = storePrices.useStore((state) => _.pickBy(
    state,
    (item) => item.providerType === providerType && symbols.includes(item.symbol),
  ));

  useQuery({
    queryFn: () => orderGetMany({ providerId }),
    queryKey: queryKeys.orders(providerId),
    refetchInterval: refreshMS,
  });

  if (!orders.length) return null;

  const [liveOrders, pendingOrders] = _.partition(
    orders,
    (order) => order.status === OrderStatus.live,
  );

  const skipClick = (e: React.SyntheticEvent) => e.preventDefault();

  const renderLiveOrder = (order: Order) => {
    const lots = getLotFromVolume({
      providerType: order.providerType,
      symbol: order.symbol,
      prices,
      volume: order.volume,
    }).lot;
    const profit = getProfit([order], prices, asset);
    return (
      <Group key={order._id} spacing={0}>
        <BuySellIcon direction={order.direction} />
        <Text>{`${lots} ${order.symbol} (${_.round(profit, 2)} ${asset})`}</Text>
      </Group>
    );
  };

  const renderPendingOrder = (order: Order) => {
    const lots = getLotFromVolume({
      providerType: order.providerType,
      symbol: order.symbol,
      prices,
      volume: order.volume,
    }).lot;
    const pips = Math.abs(getDiffPips({
      providerType: order.providerType,
      symbol: order.symbol,
      prices,
      entry: getEntry(order) || 0,
      price: prices[`${order.providerType}-${order.symbol}`]?.last || 0,
    }).pips || 0);
    return (
      <Group key={order._id} spacing={0}>
        <BuySellIcon direction={order.direction} />
        <Text>{`${lots} ${order.symbol} (${_.round(pips, 2)} pips)`}</Text>
      </Group>
    );
  };

  const profit = getProfit(liveOrders, prices, asset);
  const {
    equity = 0,
    profitRatio = 0,
    margin = 0,
  } = getAccountStats(balance, profit, liveOrders, marginRaw);
  const profitIcon = getProfitIcon(profitRatio, true);

  return (
    <Popover content={(
      <>
        <Text>{`Equity: ${_.round(equity, 2)} ${asset}`}</Text>
        <Text>{`Margin: ${_.round(margin, 2)} ${asset}`}</Text>
        <Text>{`Live Orders [${liveOrders.length}]`}</Text>
        {liveOrders.map(renderLiveOrder)}
        <Text>{`Pending Orders [${pendingOrders.length}]`}</Text>
        {pendingOrders.map(renderPendingOrder)}
      </>
    )}
    >
      <Stack spacing={4}>
        <Group spacing={0} onClick={skipClick}>
          <Text color={profit > 0 ? 'green' : 'red'}>
            {`Profit: ${_.round(profit, 2)} ${asset} (${_.round(profitRatio, 2)}% ${profitIcon})`}
          </Text>
          <Indicator label={orders.length} size={orders.length && 16}>
            <Icon name="Info" button />
          </Indicator>
        </Group>
        <TargetProgress providerId={providerId} profit={profit} slim />
      </Stack>
    </Popover>
  );
}

export default TradeInfo;
