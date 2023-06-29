import orderGetManyInfo from '@fishbot/cross/api/orders/getManyInfo';
import orderUpdateSettings from '@fishbot/cross/api/orders/updateSettings';
import { useMutate } from '@fishbot/cross/libs/query';
import storeOrders from '@fishbot/cross/stores/orders';
import storeUser from '@fishbot/cross/stores/user';
import { OrderStatus } from '@fishbot/utils/constants/order';
import _ from 'lodash';
import { useState } from 'react';

import Avatar from '~ui/core/Avatar';
import Button from '~ui/core/Button';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Indicator from '~ui/core/Indicator';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Tooltip from '~ui/core/Tooltip';
import openConfirmModal from '~ui/modals/openConfirmModal';
import { toastError } from '~ui/toast';

interface Props {
  orderId: string,
  onClose?: () => void;
}

const getIconProps = (point: number) => {
  if (!point) return { name: 'Battery50' };
  if (point === -1) return { name: 'Battery20', color: 'red' };
  if (point < -1) return { name: 'Battery0Bar', color: 'red' };
  if (point === 1) return { name: 'Battery80', color: 'green' };
  if (point > 1) return { name: 'BatteryFull', color: 'green' };
  return { name: 'Battery50' };
};

const getText = (point: number) => {
  if (!point) return 'Neutral';
  if (point < -1) return 'Very Low';
  if (point === -1) return 'Low';
  if (point === 1) return 'High';
  if (point > 1) return 'Very High';
  return 'Neutral';
};

function OrderConfidence({ orderId, onClose }: Props) {
  const {
    userId,
    members = [],
  } = storeUser.useStore((state) => ({
    userId: state.info?._id,
    members: state.activeProvider?.members,
  }));
  const order = storeOrders.useStore((state) => state[orderId]);

  const [pointInput, setPointInput] = useState<number | undefined>();

  const {
    providerId = '',
    status = OrderStatus.idea,
    confidences = {},
  } = order || {};

  const memberPoints = members.map((member) => ({
    ...member,
    point: confidences[member.userId] ?? 0,
  }));
  const userPoint = memberPoints.find((item) => item.userId === userId);
  const point = pointInput ?? userPoint?.point ?? 0;
  const totalPoints = _.sumBy(
    memberPoints,
    (item) => (item.userId === userId ? point : item.point),
  );

  const { mutate: reload, isLoading: isLoadingReload } = useMutate({
    mutationFn: orderGetManyInfo,
  });

  const { mutate: saveOrder, isLoading: isLoadingSave } = useMutate({
    mutationFn: orderUpdateSettings,
  });

  const onReload = () => reload({ providerId, orderIds: [orderId], fields: ['confidences'] });

  const onRemove = () => setPointInput((prev) => {
    const curr = prev ?? point;
    return curr > -2 ? curr - 1 : curr;
  });

  const onAdd = () => setPointInput((prev) => {
    const curr = prev ?? point;
    return curr < 2 ? curr + 1 : curr;
  });

  const onSave = async () => {
    if (!(await openConfirmModal())) return;

    saveOrder({
      providerId,
      orderId,
      confidence: point,
      chat: `${point}`,
      chatType: 'confidence',
    }, {
      onSuccess: () => { if (onClose) onClose(); },
      onError: (err) => toastError(`${err}`),
    });
  };

  if (!userPoint) return null;

  return (
    <Stack>
      <Text>Are you sure of this order? In which confidence level?</Text>
      <Group position="apart">
        <Group>
          <Tooltip label={userPoint.name}><Avatar size="sm" src={userPoint.picture} alt={userPoint.userId} /></Tooltip>
          <Indicator label={`${point}`} size={16}>
            <Icon {...getIconProps(point)} />
          </Indicator>
          <Text>{getText(point)}</Text>
        </Group>
        <Group>
          <Icon
            name="Remove"
            color="red"
            button
            buttonProps={{ variant: 'outline' }}
            onClick={onRemove}
            disabled={point === -2}
          />
          <Icon
            name="Add"
            color="green"
            button
            buttonProps={{ variant: 'outline' }}
            onClick={onAdd}
            disabled={point === 2}
          />
        </Group>
      </Group>
      {_.orderBy(memberPoints, ['point'], ['desc']).map((item) => item.userId !== userId && (
        <Group key={item.userId}>
          <Tooltip label={item.name}><Avatar size="sm" src={item.picture} alt={item.userId} /></Tooltip>
          <Indicator label={`${item.point}`} size={16}>
            <Icon {...getIconProps(item.point)} />
          </Indicator>
          <Text>{getText(item.point)}</Text>
        </Group>
      ))}
      <Group position="apart">
        <Group spacing="xs">
          Total
          <Indicator label={`${totalPoints}`} size={16}>
            <Icon {...getIconProps(totalPoints)} />
          </Indicator>
          <Text>{getText(totalPoints)}</Text>
        </Group>
        <Group>
          <Icon name="Sync" button onClick={onReload} loading={isLoadingReload} tooltip="Refresh" />
          <Button
            onClick={onSave}
            loading={isLoadingSave}
            disabled={pointInput === undefined
              || pointInput === userPoint.point
              || ![OrderStatus.live, OrderStatus.pending].includes(status)}
          >
            Save
          </Button>
          <Button variant="subtle" onClick={onClose}>Close</Button>
        </Group>
      </Group>
    </Stack>
  );
}

export default OrderConfidence;

export { getIconProps };
