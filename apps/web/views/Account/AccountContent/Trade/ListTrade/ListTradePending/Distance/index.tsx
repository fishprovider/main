import type { Order } from '@fishbot/utils/types/Order.model';
import type { Price } from '@fishbot/utils/types/Price.model';
import _ from 'lodash';
import moment from 'moment';

import Text from '~ui/core/Text';
import Tooltip from '~ui/core/Tooltip';

interface Props {
  order: Order;
  prices: Record<string, Price>;
}

function Distance({ order, prices }: Props) {
  const { providerType, symbol, distance = 0 } = order as Order & { distance?: number };

  const priceDoc = prices[`${providerType}-${symbol}`];
  if (!priceDoc) return null;

  const isOutOfDate = moment().diff(moment(priceDoc.time), 'minutes') > 5;

  return (
    <Tooltip label={`Updated ${moment(priceDoc.time).fromNow()}`}>
      {isOutOfDate && <Text>❌ Out of date ❌</Text>}
      <Text>{`${_.round(distance, 2)} pips`}</Text>
    </Tooltip>
  );
}

export default Distance;
