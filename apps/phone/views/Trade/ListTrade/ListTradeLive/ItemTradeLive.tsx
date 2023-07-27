import { FontAwesome } from '@expo/vector-icons';
import { Direction } from '@fishprovider/utils/dist/constants/order';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import type { Price } from '@fishprovider/utils/dist/types/Price.model';

import CloseOrderModal from '~components/CloseOrderModal';
import OrderInfo from '~components/OrderInfo';
import Profit from '~components/Profit';
import Group from '~ui/Group';
import H6 from '~ui/H6';
import { useModalSimple } from '~ui/ModalProvider';

interface Props {
  order: Order;
  prices: Record<string, Price>;
  mergedView: boolean;
  unmergeView: () => void;
}

function ItemTradeLive({
  order, prices, mergedView, unmergeView,
}: Props) {
  const [showModal] = useModalSimple({
    title: <H6>Are you sure?</H6>,
    content: <CloseOrderModal order={order} />,
  });

  const onClose = async () => {
    showModal();
  };

  return (
    <Group justifyContent="space-between" borderWidth={1} padding={4}>
      <Group>
        {order.direction === Direction.buy ? (
          <FontAwesome name="chevron-up" color="green" size={15} />
        ) : (
          <FontAwesome name="chevron-down" color="red" size={15} />
        )}
        <OrderInfo order={order} mergedView={mergedView} />
      </Group>
      <Group>
        <Profit order={order} prices={prices} />
        <FontAwesome
          name="window-close"
          color="orange"
          size={20}
          onPress={onClose}
        />
        {mergedView && (
          <FontAwesome
            name="expand"
            size={15}
            onPress={unmergeView}
          />
        )}
      </Group>
    </Group>
  );
}

export default ItemTradeLive;
