import { FontAwesome } from '@expo/vector-icons';
import { Direction } from '@fishprovider/utils/dist/constants/order';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import type { Price } from '@fishprovider/utils/dist/types/Price.model';
import _ from 'lodash';

import Group from '~ui/Group';
import Text from '~ui/Text';

interface Props {
  order: Order;
  prices: Record<string, Price>;
}

function ItemTradePending({ order, prices }: Props) {
  const onClose = async () => {
    Logger.debug('ItemTradePending', _.size(prices));
  };

  return (
    <Group justifyContent="space-between" alignItems="center" borderWidth={1} padding={4}>
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
      <FontAwesome
        name="window-close-o"
        color="orange"
        size={20}
        onPress={onClose}
      />
    </Group>
  );
}

export default ItemTradePending;
