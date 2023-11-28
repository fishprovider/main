import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import type { Price } from '@fishprovider/utils/dist/types/Price.model';
import _ from 'lodash';

import { watchUserInfoController } from '~controllers/user.controller';
import Text from '~ui/Text';

interface Props {
  order: Order;
  prices: Record<string, Price>;
}

function Profit({ order, prices }: Props) {
  const { providerType, symbol, profit = 0 } = order;

  const {
    asset = 'USD',
  } = watchUserInfoController((state) => ({
    asset: state.activeAccount?.asset,
  }));

  const priceDoc = prices[`${providerType}-${symbol}`];

  if (!priceDoc || !order.price) return null;

  return (
    <Text color={profit > 0 ? 'green' : 'red'}>
      {`${_.round(profit, 2)} ${asset}`}
    </Text>
  );
}

export default Profit;
