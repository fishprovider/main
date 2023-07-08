import type { Order } from '@fishprovider/utils/types/Order.model';
import _ from 'lodash';

import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import openConfirmModal from '~ui/modals/openConfirmModal';
import { toastError, toastInfo } from '~ui/toast';

interface Props {
  order: Order;
}

function HideOrder({ order }: Props) {
  const onHide = async () => {
    const {
      direction, volume, symbol, stopLoss, takeProfit,
    } = order;

    if (!stopLoss || !takeProfit) {
      toastError('StopLoss and TakeProfit are required to set before hiding order');
      return;
    }

    if (!(await openConfirmModal({
      title: `Hide Order ${_.upperFirst(direction)} ${volume} ${symbol}?`,
    }))) return;

    toastInfo('Coming soon');
  };

  return (
    <Group spacing="xs" onClick={onHide}>
      <Icon name="VisibilityOff" size="small" button />
      Hide Order
    </Group>
  );
}

export default HideOrder;
