import { Direction } from '@fishbot/utils/constants/order';

import Icon from '~ui/core/Icon';

interface Props {
  direction: Direction;
}

function BuySellIcon({ direction }: Props) {
  if (direction === Direction.buy) return <Icon name="ArrowUpward" color="green" tooltip="Buy" />;
  if (direction === Direction.sell) return <Icon name="ArrowDownward" color="red" tooltip="Sell" />;
  return null;
}

export default BuySellIcon;
