import type { Order } from '@fishbot/utils/types/Order.model';

import Icon from '~ui/core/Icon';
import Title from '~ui/core/Title';
import openModal from '~ui/modals/openModal';

import SettingsModal from './SettingsModal';

interface Props {
  order: Order,
}

export default function OrderSettings({ order }: Props) {
  const onEdit = () => openModal({
    title: <Title size="h4">Order Settings</Title>,
    content: <SettingsModal order={order} />,
  });

  return (
    <Icon name="Settings" size="small" button onClick={onEdit} tooltip="Settings" />
  );
}
