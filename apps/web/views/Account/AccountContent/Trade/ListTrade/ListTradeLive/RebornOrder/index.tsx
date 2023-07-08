import orderUpdateSettings from '@fishprovider/cross/api/orders/updateSettings';
import { useMutate } from '@fishprovider/cross/libs/query';
import type { Order } from '@fishprovider/utils/types/Order.model';

import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import openConfirmModal from '~ui/modals/openConfirmModal';
import { toastError, toastInfo } from '~ui/toast';

interface Props {
  order: Order,
}

function RebornOrder({ order }: Props) {
  const {
    _id: orderId,
    providerId,
    reborn,
  } = order;

  const { mutate: saveOrder, isLoading } = useMutate({
    mutationFn: orderUpdateSettings,
  });

  const onReborn = async () => {
    const isComingSoon = true;
    if (isComingSoon) {
      toastInfo('Coming soon! Reborn is a bot that will auto re-open a new market order at the SL price of this order after hitting SL 👼');
      return;
    }

    if (!(await openConfirmModal({
      title: reborn ? 'Are you sure to disable reborn bot?' : 'Are you sure to enable reborn bot?',
    }))) return;

    saveOrder({
      providerId,
      orderId,
      reborn: !reborn,
      chat: `${!reborn}`,
      chatType: 'reborn',
    }, {
      onError: (err) => toastError(`${err}`),
    });
  };

  return (
    <Group spacing="xs" onClick={onReborn}>
      <Icon
        name={reborn ? 'PunchClock' : 'PunchClockOutlined'}
        color={reborn ? 'red' : 'gray'}
        size="small"
        button
        loading={isLoading}
      />
      Reborn Order
    </Group>
  );
}

export default RebornOrder;
