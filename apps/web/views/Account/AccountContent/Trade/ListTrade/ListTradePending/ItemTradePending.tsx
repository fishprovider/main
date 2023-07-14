import orderRemove from '@fishprovider/cross/dist/api/orders/remove';
import { useMutate } from '@fishprovider/cross/dist/libs/query';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import type { Price } from '@fishprovider/utils/dist/types/Price.model';
import _ from 'lodash';

import OrderActivities from '~components/order/OrderActivities';
import OrderInfo from '~components/order/OrderInfo';
import OrderSettings from '~components/order/OrderSettings';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Table from '~ui/core/Table';
import openConfirmModal from '~ui/modals/openConfirmModal';
import { toastError, toastSuccess } from '~ui/toast';

import Distance from './Distance';

interface Props {
  order: Order;
  prices: Record<string, Price>;
}

function ItemTradePending({ order, prices }: Props) {
  const {
    providerId = '',
    roles,
  } = storeUser.useStore((state) => ({
    providerId: state.activeProvider?._id,
    roles: state.info?.roles,
  }));
  const { isTraderProvider, isProtectorProvider } = getRoleProvider(roles, providerId);

  const { mutate: close, isLoading } = useMutate({
    mutationFn: orderRemove,
  });

  const onClose = async () => {
    const {
      direction, volume, symbol,
    } = order;

    if (!(await openConfirmModal({
      title: `Close ${_.upperFirst(direction)} ${volume} ${symbol}?`,
    }))) return;

    close({ order }, {
      onSuccess: () => toastSuccess('Done'),
      onError: (err) => toastError(`${err}`),
    });
  };

  const renderActions = () => (
    <Group spacing={0}>
      {isTraderProvider && <OrderSettings order={order} />}
      <Icon name="Delete" size="small" button onClick={onClose} loading={isLoading} tooltip="Close order" />
    </Group>
  );

  return (
    <Table.Row key={order._id}>
      <Table.Cell><OrderInfo order={order} /></Table.Cell>
      <Table.Cell><OrderActivities order={order} /></Table.Cell>
      <Table.Cell><Distance order={order} prices={prices} /></Table.Cell>
      {(isTraderProvider || isProtectorProvider) && <Table.Cell>{renderActions()}</Table.Cell>}
    </Table.Row>
  );
}

export default ItemTradePending;
