import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import _ from 'lodash';

import Icon from '~ui/core/Icon';
import Indicator from '~ui/core/Indicator';
import Title from '~ui/core/Title';
import openModal from '~ui/modals/openModal';

import ChatModal from './ChatModal';

interface Props {
  order: Order,
}

function OrderChat({ order }: Props) {
  const onEdit = () => openModal({
    title: <Title size="h4">Chat</Title>,
    content: <ChatModal orderId={order._id} />,
  });

  const count = _.size(order.chats);
  return (
    <Indicator label={count} size={16}>
      <Icon name="Comment" size="small" button onClick={onEdit} tooltip="Chats" />
    </Indicator>
  );
}

export default OrderChat;
