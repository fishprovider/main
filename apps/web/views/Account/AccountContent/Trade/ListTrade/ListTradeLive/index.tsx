import orderGetMany from '@fishbot/cross/api/orders/getMany';
import orderGetManyInfo from '@fishbot/cross/api/orders/getManyInfo';
import orderRemove from '@fishbot/cross/api/orders/remove';
import { useMutate } from '@fishbot/cross/libs/query';
import storePrices from '@fishbot/cross/stores/prices';
import storeUser from '@fishbot/cross/stores/user';
import { ProviderType } from '@fishbot/utils/constants/account';
import { OrderStatus } from '@fishbot/utils/constants/order';
import { getProfit } from '@fishbot/utils/helpers/order';
import { getMajorPairs } from '@fishbot/utils/helpers/price';
import { getRoleProvider } from '@fishbot/utils/helpers/user';
import { validateOrderRemove } from '@fishbot/utils/helpers/validateOrder';
import type { Account } from '@fishbot/utils/types/Account.model';
import type { Order } from '@fishbot/utils/types/Order.model';
import type { User } from '@fishbot/utils/types/User.model';
import _ from 'lodash';
import { useState } from 'react';

import { activityFields } from '~constants/account';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Table from '~ui/core/Table';
import openConfirmModal from '~ui/modals/openConfirmModal';
import { toastError, toastSuccess } from '~ui/toast';

import ItemTradeLive from './ItemTradeLive';

interface Props {
  orders: Order[];
}

const orderRemoveAll = (orders: Order[]) => Promise.all(
  orders.map((order) => orderRemove({ order })),
);

function ListTradeLive({ orders }: Props) {
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

  const nonLockedOrders = orders.filter((order) => !order.lock);

  const { mutate: reload, isLoading: isLoadingReload } = useMutate({
    mutationFn: orderGetMany,
  });

  const { mutate: closeAll, isLoading: isLoadingCloseAll } = useMutate({
    mutationFn: orderRemoveAll,
  });

  const [mergedViewInput, setMergedViewInput] = useState<boolean>();
  const mergedView = mergedViewInput ?? orders.length > 5;

  const [sortProfit, setSortProfit] = useState(false);

  const onReload = () => {
    reload({
      providerId,
      orderStatus: OrderStatus.live,
      reload: true,
    }, {
      onSuccess: (res) => {
        const orderIds = res.positions.map((item) => item._id);
        if (!orderIds.length) return;
        orderGetManyInfo({ providerId, orderIds, fields: activityFields });
      },
    });
  };

  const validate = (orderToRemove: Order) => {
    const {
      info: user,
      activeProvider: account,
    } = storeUser.getState() as {
      info: User,
      activeProvider: Account,
    };

    return validateOrderRemove({
      user,
      account,
      orderToRemove,
      prices: storePrices.getState(),
    });
  };

  const onCloseAll = async () => {
    const errOrders = nonLockedOrders.map(validate).filter(({ error }) => error);
    if (errOrders.length) {
      errOrders.forEach(({ error }) => error && toastError(error));
      return;
    }

    if (!(await openConfirmModal({
      title: `Confirm to close all ${nonLockedOrders.length} orders (excluding locked orders)?`,
    }))) return;

    closeAll(nonLockedOrders, {
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
    <Table>
      <Table.THead>
        <Table.Row>
          <Table.Header>
            <Group spacing={0}>
              🚀 Live Orders
              <Icon
                name="Sync"
                size="small"
                button
                onClick={onReload}
                loading={isLoadingReload}
                tooltip="Reload"
              />
              <Icon
                name="Merge"
                size="small"
                button
                onClick={() => setMergedViewInput(
                  (prev) => (prev === undefined ? !mergedView : !prev),
                )}
                color={mergedView ? 'teal' : 'gray'}
                buttonProps={{
                  style: {
                    transform: mergedView ? 'rotate(90deg)' : '',
                  },
                }}
                tooltip="Aggregate Orders"
              />
            </Group>
          </Table.Header>
          {mergedView ? null : (
            <Table.Header>
              Activities
            </Table.Header>
          )}
          <Table.Header>
            <Group spacing={0}>
              Profit
              <Icon
                name="Sort"
                size="small"
                button
                onClick={() => setSortProfit((prev) => !prev)}
                buttonProps={{
                  style: {
                    transform: sortProfit ? 'rotate(180deg)' : '',
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

export default ListTradeLive;
