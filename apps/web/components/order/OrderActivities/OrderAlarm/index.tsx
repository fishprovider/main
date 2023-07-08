import orderUpdateSettings from '@fishprovider/cross/api/orders/updateSettings';
import { useMutate } from '@fishprovider/cross/libs/query';
import { OrderStatus } from '@fishprovider/utils/constants/order';
import type { Order } from '@fishprovider/utils/types/Order.model';

import Icon from '~ui/core/Icon';
import openConfirmModal from '~ui/modals/openConfirmModal';
import { toastError } from '~ui/toast';

interface Props {
  order: Order,
}

function OrderAlarm({ order }: Props) {
  const {
    _id: orderId,
    providerId,
    alarm,
  } = order;

  const { mutate: saveOrder, isLoading } = useMutate({
    mutationFn: orderUpdateSettings,
  });

  const onAlarm = async () => {
    if (!(await openConfirmModal({
      title: alarm
        ? 'Are you sure to turn alarm off now?'
        : 'Are you sure to turn alarm on and notify all members now?',
    }))) return;

    saveOrder({
      providerId,
      orderId,
      alarm: !alarm,
      chat: `${!alarm}`,
      chatType: 'alarm',
    }, {
      onError: (err) => toastError(`${err}`),
    });
  };

  return (
    <Icon
      name={alarm ? 'NotificationsActive' : 'NotificationsNone'}
      color={alarm ? 'red' : 'gray'}
      size="small"
      button
      onClick={[OrderStatus.live, OrderStatus.pending].includes(order.status) ? onAlarm : undefined}
      loading={isLoading}
      tooltip="Alarm"
    />
  );
}

export default OrderAlarm;
