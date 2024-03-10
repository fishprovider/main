import { getRoleProvider } from '@fishprovider/core';
import orderRemoveIdea from '@fishprovider/cross/dist/api/orders/removeIdea';
import { useMutate } from '@fishprovider/cross/dist/libs/query';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import type { Price } from '@fishprovider/utils/dist/types/Price.model';
import _ from 'lodash';

import OrderInfo from '~components/order/OrderInfo';
import Profit from '~components/order/Profit';
import { watchUserInfoController } from '~controllers/user.controller';
import Button from '~ui/core/Button';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Table from '~ui/core/Table';
import openConfirmModal from '~ui/modals/openConfirmModal';
import { toastError, toastInfo, toastSuccess } from '~ui/toast';

interface Props {
  order: Order;
  prices: Record<string, Price>;
}

function ItemTradeIdea({ order, prices }: Props) {
  const {
    providerId = '',
    roles,
  } = watchUserInfoController((state) => ({
    providerId: state.activeAccount?._id,
    roles: state.activeUser?.roles,
  }));
  const { isTraderAccount, isProtectorAccount } = getRoleProvider(roles, providerId);

  const { mutate: close, isLoading } = useMutate({
    mutationFn: orderRemoveIdea,
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

  const onCopy = () => {
    toastInfo('Coming soon');
  };

  const renderActions = () => (
    <Group spacing={0}>
      {isTraderAccount && order.copyId && order.price && <Button onClick={onCopy}>Copy</Button>}
      {!(order.copyId && order.price) && <Icon name="Delete" size="small" button onClick={onClose} loading={isLoading} tooltip="Close idea" />}
    </Group>
  );

  return (
    <Table.Row key={order._id}>
      <Table.Cell><OrderInfo order={order} /></Table.Cell>
      <Table.Cell><Profit order={order} prices={prices} /></Table.Cell>
      {(isTraderAccount || isProtectorAccount) && <Table.Cell>{renderActions()}</Table.Cell>}
    </Table.Row>
  );
}

export default ItemTradeIdea;
