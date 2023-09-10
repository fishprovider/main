import storeOrders from '@fishprovider/cross/dist/stores/orders';
import storePrices from '@fishprovider/cross/dist/stores/prices';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { ProviderType } from '@fishprovider/utils/dist/constants/account';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';
import { getProfit, getProfitIcon } from '@fishprovider/utils/dist/helpers/order';
import { getMajorPairs } from '@fishprovider/utils/dist/helpers/price';
import _ from 'lodash';

import Stack from '~ui/Stack';
import Text from '~ui/Text';
import { getAccountStats } from '~utils/account';

export default function TradeHeader() {
  const {
    providerId,
    providerType = ProviderType.icmarkets,
    balance = 0,
    leverage,
    marginRaw = 0,
    asset = 'USD',
  } = storeUser.useStore((state) => ({
    providerId: state.activeProvider?._id,
    providerType: state.activeProvider?.providerType,
    balance: state.activeProvider?.balance,
    leverage: state.activeProvider?.leverage,
    marginRaw: state.activeProvider?.margin,
    asset: state.activeProvider?.asset,
  }));

  const liveOrders = storeOrders.useStore((state) => _.filter(
    state,
    (order) => order.providerId === providerId && order.status === OrderStatus.live,
  ));
  const symbols = _.uniq([
    ...getMajorPairs(providerType),
    ...liveOrders.map((order) => order.symbol),
  ]);

  const prices = storePrices.useStore((state) => _.pickBy(
    state,
    (item) => item.providerType === providerType && symbols.includes(item.symbol),
  ));

  const profit = getProfit(liveOrders, prices, asset);

  const {
    equity = 0,
    profitRatio = 0,
    margin = 0,
    marginFree = 0,
    marginLevel = 0,
  } = getAccountStats(balance, profit, liveOrders, marginRaw);

  return (
    <Stack>
      <Text>
        💰 Balance:
        {' '}
        {balance}
        {' '}
        {asset}
      </Text>
      {!!leverage && (
        <Text>
          ⚖️ Leverage:
          {' '}
          <Text>{`1:${leverage}`}</Text>
        </Text>
      )}
      {profit ? (
        <Text>
          💸 Equity:
          {' '}
          <Text color={profit > 0 ? 'green' : 'red'}>
            {`${_.round(equity, 2)} ${asset} (${_.round(profit, 2)} ${asset}, ${_.round(profitRatio, 2)}% ${getProfitIcon(profitRatio)})`}
          </Text>
        </Text>
      ) : null}
      {margin ? (
        <Text>
          🏦 Margin:
          {' '}
          <Text color={marginLevel - 100 > 0 ? 'green' : 'red'}>
            {`${_.round(margin, 2)} ${asset} (Free: ${_.round(marginFree, 2)} ${asset}, Level: ${_.round(marginLevel, 2)}%)`}
          </Text>
        </Text>
      ) : null}
    </Stack>
  );
}
