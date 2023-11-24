import { Direction, OrderStatus } from '@fishprovider/utils/dist/constants/order';
import { getProfitIcon } from '@fishprovider/utils/dist/helpers/order';
import { getDiffPips } from '@fishprovider/utils/dist/helpers/price';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import type { Price } from '@fishprovider/utils/dist/types/Price.model';
import _ from 'lodash';
import moment from 'moment';

import ProfitColor from '~components/price/ProfitColor';
import { watchUserInfoController } from '~controllers/user.controller';
import Text from '~ui/core/Text';
import Tooltip from '~ui/core/Tooltip';

interface Props {
  order: Order;
  prices: Record<string, Price>;
}

function Profit({ order, prices }: Props) {
  const { providerType, symbol, profit = 0 } = order;

  const {
    balance = 0,
    asset = 'USD',
  } = watchUserInfoController((state) => ({
    balance: state.activeAccount?.balance,
    asset: state.activeAccount?.asset,
  }));

  const priceDoc = prices[`${providerType}-${symbol}`];

  if (!priceDoc || !order.price) return null;

  const isOutOfDate = moment().diff(moment(priceDoc.time), 'minutes') > 5;

  const profitRatio = balance ? (100 * profit) / balance : 0;
  const profitIcon = getProfitIcon(profitRatio);

  const renderPips = () => {
    if (order.status !== OrderStatus.live || !order.price) return null;

    const pips = getDiffPips({
      providerType,
      symbol,
      prices,
      ...(order.direction === Direction.buy ? {
        entry: order.price,
        price: priceDoc.last,
      } : {
        entry: priceDoc.last,
        price: order.price,
      }),
    }).pips || 0;
    return ` (${_.round(pips, 2)} pips)`;
  };

  return (
    <Tooltip label={`Updated ${moment(priceDoc.time).fromNow()}`}>
      <ProfitColor profit={profit}>
        {isOutOfDate && <Text>❌ Out of date ❌</Text>}
        <Text>
          {`${_.round(profit, 2)} ${asset}`}
          {renderPips()}
          {` (${_.round(profitRatio, 2)}% ${profitIcon})`}
        </Text>
      </ProfitColor>
    </Tooltip>
  );
}

export default Profit;
