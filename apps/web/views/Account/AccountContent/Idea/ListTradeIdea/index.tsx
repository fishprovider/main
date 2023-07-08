import orderGetIdea from '@fishprovider/cross/api/orders/getIdea';
import { useMutate } from '@fishprovider/cross/libs/query';
import storeOrders from '@fishprovider/cross/stores/orders';
import storePrices from '@fishprovider/cross/stores/prices';
import storeUser from '@fishprovider/cross/stores/user';
import { ProviderType } from '@fishprovider/utils/constants/account';
import { OrderStatus } from '@fishprovider/utils/constants/order';
import { getProfit } from '@fishprovider/utils/helpers/order';
import { getMajorPairs } from '@fishprovider/utils/helpers/price';
import { getRoleProvider } from '@fishprovider/utils/helpers/user';
import _ from 'lodash';

import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Table from '~ui/core/Table';

import ItemTradeIdea from './ItemTradeIdea';

function ListTradeIdea() {
  const {
    providerId = '',
    providerType = ProviderType.icmarkets,
    asset = 'USD',
    roles,
  } = storeUser.useStore((state) => ({
    providerId: state.activeProvider?._id,
    providerType: state.activeProvider?.providerType,
    asset: state.activeProvider?.asset,
    roles: state.info?.roles,
  }));

  const orders = storeOrders.useStore((state) => (
    _.filter(
      state,
      (order) => order.providerId === providerId
        && order.status === OrderStatus.idea,
    )
  ));

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

  const { isTraderProvider, isProtectorProvider } = getRoleProvider(roles, providerId);

  const { mutate: reload, isLoading: isLoadingReload } = useMutate({
    mutationFn: orderGetIdea,
  });

  const onReload = () => reload({
    providerId,
    reload: true,
  });

  const renderBody = () => {
    if (!orders.length) {
      return (
        <Table.Row>
          <Table.Cell colSpan={4}>N.A.</Table.Cell>
        </Table.Row>
      );
    }

    let viewOrders = orders;

    viewOrders = viewOrders.map((item) => {
      const profit = getProfit([item], prices, asset);
      return {
        ...item,
        profit,
      };
    });

    return viewOrders.map((order) => (
      <ItemTradeIdea
        key={order._id}
        order={order}
        prices={prices}
      />
    ));
  };

  return (
    <Table>
      <Table.THead>
        <Table.Row>
          <Table.Header>
            <Group spacing={0}>
              💡 Ideas
              <Icon name="Sync" size="small" button onClick={onReload} loading={isLoadingReload} />
            </Group>
          </Table.Header>
          <Table.Header>Profit</Table.Header>
          {(isTraderProvider || isProtectorProvider) && (
            <Table.Header>
              <Group spacing={0}>
                Actions
              </Group>
            </Table.Header>
          )}
        </Table.Row>
      </Table.THead>
      <Table.TBody>
        {renderBody()}
      </Table.TBody>
    </Table>
  );
}

export default ListTradeIdea;
