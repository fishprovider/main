import accountGet from '@fishprovider/cross/dist/api/accounts/get';
import { useMutate } from '@fishprovider/cross/dist/libs/query';
import storeOrders from '@fishprovider/cross/dist/stores/orders';
import storePrices from '@fishprovider/cross/dist/stores/prices';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { ProviderType } from '@fishprovider/utils/dist/constants/account';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';
import { getProfit, getProfitIcon } from '@fishprovider/utils/dist/helpers/order';
import { getMajorPairs } from '@fishprovider/utils/dist/helpers/price';
import _ from 'lodash';

import EquityProgress from '~components/account/EquityProgress';
import { getAccountController } from '~controller-services/account/getAccount.controller';
import Grid from '~ui/core/Grid';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import { getAccountStats } from '~utils/account';

function AccountBalance() {
  const {
    providerId = '',
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

  const { mutate: reload, isLoading } = useMutate({
    mutationFn: accountGet,
  });
  const { mutate: reloadV3, isLoading: isLoadingV3 } = useMutate({
    mutationFn: (accountId: string) => getAccountController({
      accountId,
    }),
  });

  const onReload = () => {
    reload({ providerId, reload: true });
    reloadV3(providerId);
  };

  return (
    <Stack>
      <Grid>
        <Grid.Col xs={12} md={4}>
          <Group spacing={0}>
            <Text>
              💰 Balance:
              {' '}
              <Text fw={700} span>{`${balance} ${asset}`}</Text>
            </Text>
            <Icon name="Sync" size="small" button onClick={onReload} loading={isLoading || isLoadingV3} />
          </Group>
          {!!leverage && (
            <Text>
              ⚖️ Leverage:
              {' '}
              <Text fw={700} span>{`1:${leverage}`}</Text>
            </Text>
          )}
        </Grid.Col>
        <Grid.Col xs={12} md={8}>
          {profit ? (
            <Text>
              💸 Equity:
              {' '}
              <Text fw={700} span c={profit > 0 ? 'green' : 'red'}>
                {`${_.round(equity, 2)} ${asset} (${_.round(profit, 2)} ${asset}, ${_.round(profitRatio, 2)}% ${getProfitIcon(profitRatio)})`}
              </Text>
            </Text>
          ) : null}
          {margin ? (
            <Text>
              🏦 Margin:
              {' '}
              <Text fw={700} span c={marginLevel - 100 > 0 ? 'green' : 'red'}>
                {`${_.round(margin, 2)} ${asset} (Free: ${_.round(marginFree, 2)} ${asset}, Level: ${_.round(marginLevel, 2)}%)`}
              </Text>
            </Text>
          ) : null}
        </Grid.Col>
      </Grid>
      <EquityProgress providerId={providerId} profit={profit} />
    </Stack>
  );
}

export default AccountBalance;
