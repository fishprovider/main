import orderGetMany from '@fishprovider/cross/api/orders/getMany';
import orderGetManyInfo from '@fishprovider/cross/api/orders/getManyInfo';
import orderRemove from '@fishprovider/cross/api/orders/remove';
import { useMutate } from '@fishprovider/cross/libs/query';
import storePrices from '@fishprovider/cross/stores/prices';
import storeUser from '@fishprovider/cross/stores/user';
import { ProviderType } from '@fishprovider/utils/constants/account';
import { OrderStatus } from '@fishprovider/utils/constants/order';
import { getEntry } from '@fishprovider/utils/helpers/order';
import { getDiffPips, getMajorPairs } from '@fishprovider/utils/helpers/price';
import { getRoleProvider } from '@fishprovider/utils/helpers/user';
import type { Order } from '@fishprovider/utils/types/Order.model';
import _ from 'lodash';
import { useState } from 'react';

import { activityFields } from '~constants/account';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Table from '~ui/core/Table';
import openConfirmModal from '~ui/modals/openConfirmModal';
import { toastError, toastSuccess } from '~ui/toast';

import ItemTradePending from './ItemTradePending';

const orderRemoveAll = (orders: Order[]) => Promise.all(
  orders.map((order) => orderRemove({ order })),
);

interface Props {
  orders: Order[];
}

function ListTradePending({ orders }: Props) {
  const {
    providerId = '',
    providerType = ProviderType.icmarkets,
    roles,
  } = storeUser.useStore((state) => ({
    providerId: state.activeProvider?._id,
    providerType: state.activeProvider?.providerType,
    roles: state.info?.roles,
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

  const { isTraderProvider, isProtectorProvider } = getRoleProvider(roles, providerId);

  const { mutate: reload, isLoading: isLoadingReload } = useMutate({
    mutationFn: orderGetMany,
  });

  const { mutate: closeAll, isLoading: isLoadingCloseAll } = useMutate({
    mutationFn: orderRemoveAll,
  });

  const [sortDistance, setSortDistance] = useState(true);

  const onReload = () => {
    reload({
      providerId,
      orderStatus: OrderStatus.pending,
      reload: true,
    }, {
      onSuccess: (res) => {
        const orderIds = res.orders.map((item) => item._id);
        if (!orderIds.length) return;
        orderGetManyInfo({ providerId, orderIds, fields: activityFields });
      },
    });
  };

  const onCloseAll = async () => {
    if (!(await openConfirmModal({
      title: `Confirm to close all ${orders.length} orders?`,
    }))) return;

    closeAll(orders, {
      onSuccess: () => toastSuccess('Done'),
      onError: (err) => toastError(`${err}`),
    });
  };

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
    <Table>
      <Table.THead>
        <Table.Row>
          <Table.Header>
            <Group spacing={0}>
              ⌛ Pending Orders
              <Icon name="Sync" size="small" button onClick={onReload} loading={isLoadingReload} />
            </Group>
          </Table.Header>
          <Table.Header>
            Activities
          </Table.Header>
          <Table.Header>
            <Group spacing={0}>
              Distance
              <Icon
                name="Sort"
                size="small"
                button
                onClick={() => setSortDistance((prev) => !prev)}
                buttonProps={{
                  style: {
                    transform: sortDistance ? 'rotate(180deg)' : '',
                  },
                }}
                tooltip="Sort"
              />
            </Group>
          </Table.Header>
          {(isTraderProvider || isProtectorProvider) && (
            <Table.Header>
              <Group spacing={0}>
                Actions
                <Icon name="DeleteForever" size="small" button onClick={onCloseAll} loading={isLoadingCloseAll} tooltip="Close all" />
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

export default ListTradePending;
