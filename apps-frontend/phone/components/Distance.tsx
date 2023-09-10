import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import type { Price } from '@fishprovider/utils/dist/types/Price.model';
import _ from 'lodash';

import Text from '~ui/Text';

interface Props {
  order: Order;
  prices: Record<string, Price>;
}

function Distance({ order, prices }: Props) {
  const { providerType, symbol, distance = 0 } = order as Order & { distance?: number };

  const priceDoc = prices[`${providerType}-${symbol}`];
  if (!priceDoc) return null;

  return (
    <Text>
      {`${_.round(distance, 2)} pips`}
    </Text>
  );
}

export default Distance;
