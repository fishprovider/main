import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import type { Price } from '@fishprovider/utils/dist/types/Price.model';
import _ from 'lodash';

import Button from '~ui/Button';
import Group from '~ui/Group';
import Text from '~ui/Text';

interface Props {
  order: Order;
  prices: Record<string, Price>;
  mergedView: boolean;
  unmergeView: () => void;
}

function ItemTradeLive({
  order, prices, mergedView, unmergeView,
}: Props) {
  const onClose = async () => {
    Logger.debug('ItemTradeLive', _.size(prices));
  };

  return (
    <Group justifyContent="space-between" alignItems="center" borderWidth={1} padding={4}>
      <Text>
        {_.upperFirst(order.direction)}
        {' '}
        {order.volume}
        {' '}
        {order.symbol}
      </Text>
      <Button
        onPress={onClose}
        size="$2"
        theme="red"
      >
        x
      </Button>
      {mergedView && (
        <Button onPress={unmergeView}>M</Button>
      )}
    </Group>
  );
}

export default ItemTradeLive;
