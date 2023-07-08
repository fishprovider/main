import orderUpdateSettings from '@fishprovider/cross/api/orders/updateSettings';
import type { Order } from '@fishprovider/utils/types/Order.model';
import _ from 'lodash';

import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import openConfirmModal from '~ui/modals/openConfirmModal';
import { toastError } from '~ui/toast';

interface Props {
  order: Order;
}

function LockOrder({ order }: Props) {
  const onLock = async () => {
    if (!order.stopLoss || !order.takeProfit) {
      toastError('StopLoss and TakeProfit are required to set before locking order');
      return;
    }

    const {
      direction, volume, symbol,
    } = order;

    if (!(await openConfirmModal({
      title: `Lock Order ${_.upperFirst(direction)} ${volume} ${symbol}?`,
    }))) return;

    orderUpdateSettings({
      orderId: order._id,
      providerId: order.providerId,
      lock: true,
    });
  };

  if (order.lock) return <Icon name="Lock" size="small" button tooltip="Locked" />;

  return (
    <Group spacing="xs" onClick={onLock}>
      <Icon name="LockOpen" size="small" button />
      Lock Order
    </Group>
  );
}

export default LockOrder;
