import { getMajorPairs, getRoleProvider, ProviderType } from '@fishprovider/core';
import orderGetMany from '@fishprovider/cross/dist/api/orders/getMany';
import orderGetManyInfo from '@fishprovider/cross/dist/api/orders/getManyInfo';
import orderRemove from '@fishprovider/cross/dist/api/orders/remove';
import { useMutate } from '@fishprovider/cross/dist/libs/query';
import storePrices from '@fishprovider/cross/dist/stores/prices';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';
import { getProfit } from '@fishprovider/utils/dist/helpers/order';
import { validateOrderRemove } from '@fishprovider/utils/dist/helpers/validateOrder';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import _ from 'lodash';
import { useState } from 'react';

import { activityFields } from '~constants/account';
import { getUserInfoController, watchUserInfoController } from '~controllers/user.controller';
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
    accountId = '',
    providerType = ProviderType.icmarkets,
    asset = 'USD',
    roles,
  } = watchUserInfoController((state) => ({
    accountId: state.activeAccount?._id,
    providerType: state.activeAccount?.providerType,
    asset: state.activeAccount?.asset,
    roles: state.activeUser?.roles,
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

  const { isTraderAccount, isProtectorAccount } = getRoleProvider(roles, accountId);

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
      providerId: accountId,
      orderStatus: OrderStatus.live,
      reload: true,
    }, {
      onSuccess: (res) => {
        const orderIds = res.positions.map((item) => item._id);
        if (!orderIds.length) return;
        orderGetManyInfo({ providerId: accountId, orderIds, fields: activityFields });
      },
    });
  };

  const validate = (orderToRemove: Order) => {
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

  const onCloseAll = async (ordersToClose: Order[] = []) => {
    const errOrders = ordersToClose.map(validate).filter(({ error }) => error);
    if (errOrders.length) {
      errOrders.forEach(({ error }) => error && toastError(error));
      return;
    }

    if (!(await openConfirmModal({
      title: `Confirm to close all ${ordersToClose.length} orders (excluding locked orders)?`,
    }))) return;

    closeAll(ordersToClose, {
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
      viewOrders = _.flatMap(groupSymbolOrders, (symbolOrders, symbol) => {
        const digits = storePrices.getState()[`${providerType}-${symbol}`]?.digits;
        const directionOrders = _.groupBy(symbolOrders, (item) => item.direction);
        return _.map(directionOrders, (items) => { // max length is 2, one for BUY, one for SELL
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
        closeMergedOrders={() => {
          const mergedOrders = nonLockedOrders.filter(
            (item) => item.symbol === order.symbol && item.direction === order.direction,
          );
          onCloseAll(mergedOrders);
        }}
        isLoadingCloseMergedOrders={isLoadingCloseAll}
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
          {(isTraderAccount || isProtectorAccount) && (
            <Table.Header>
              <Group spacing={0}>
                Actions
                <Icon name="DeleteForever" size="small" button onClick={() => onCloseAll(nonLockedOrders)} loading={isLoadingCloseAll} tooltip="Close all" />
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
