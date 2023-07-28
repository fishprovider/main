import { FontAwesome } from '@expo/vector-icons';
import { Direction } from '@fishprovider/utils/dist/constants/order';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import type { Price } from '@fishprovider/utils/dist/types/Price.model';

import CloseOrder from '~components/CloseOrder';
import Group from '~ui/Group';
import Text from '~ui/Text';

interface Props {
  order: Order;
  prices: Record<string, Price>;
}

function ItemTradePending({ order, prices }: Props) {
  return (
    <Group justifyContent="space-between" borderWidth={1} padding={4}>
      <Text>
        {order.direction === Direction.buy ? (
          <FontAwesome
            name="chevron-up"
            color="green"
            size={15}
          />
        ) : (
          <FontAwesome
            name="chevron-down"
            color="red"
            size={15}
          />
        )}
        {' '}
        {order.volume}
        {' '}
        {order.symbol}
      </Text>
      <CloseOrder order={order} />
    </Group>
  );
}

export default ItemTradePending;
