import orderGetIdea from '@fishprovider/cross/dist/api/orders/getIdea';
import { useMutate } from '@fishprovider/cross/dist/libs/query';
import storeOrders from '@fishprovider/cross/dist/stores/orders';
import storePrices from '@fishprovider/cross/dist/stores/prices';
import { ProviderType } from '@fishprovider/utils/dist/constants/account';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';
import { getProfit } from '@fishprovider/utils/dist/helpers/order';
import { getMajorPairs } from '@fishprovider/utils/dist/helpers/price';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import _ from 'lodash';

import { watchUserInfoController } from '~controllers/user.controller';
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
  } = watchUserInfoController((state) => ({
    providerId: state.activeAccount?._id,
    providerType: state.activeAccount?.providerType,
    asset: state.activeAccount?.asset,
    roles: state.activeUser?.roles,
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
