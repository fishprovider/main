import type { Order } from '@fishprovider/utils/dist/types/Order.model';

import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Title from '~ui/core/Title';
import openModal from '~ui/modals/openModal';

import AverageOrderModal from './AverageOrderModal';

interface Props {
  order: Order;
}

function AverageOrder({ order }: Props) {
  const openAverageModal = () => openModal({
    title: <Title size="h4">Average Order</Title>,
    content: <AverageOrderModal order={order} />,
  });

  return (
    <Group spacing="xs" onClick={openAverageModal}>
      <Icon name="Functions" size="small" button />
      Average Order
    </Group>
  );
}

export default AverageOrder;
