import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import _ from 'lodash';

import Icon from '~ui/core/Icon';
import Indicator from '~ui/core/Indicator';
import Title from '~ui/core/Title';
import openModal from '~ui/modals/openModal';

import ConfidenceModal, { getIconProps } from './ConfidenceModal';

interface Props {
  order: Order,
}

function OrderConfidence({ order }: Props) {
  const {
    confidences = {},
  } = order;
  const point = _.sum(Object.values(confidences));

  const onEdit = () => openModal({
    title: <Title size="h4">Confidence</Title>,
    content: <ConfidenceModal orderId={order._id} />,
  });

  return (
    <Indicator label={`${point}`} size={16}>
      <Icon {...getIconProps(point)} size="small" button onClick={onEdit} tooltip="Confidence" />
    </Indicator>
  );
}

export default OrderConfidence;
