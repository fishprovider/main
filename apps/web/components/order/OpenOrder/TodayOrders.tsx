import storeOrders from '@fishbot/cross/stores/orders';
import storeUser from '@fishbot/cross/stores/user';
import { OrderStatus } from '@fishbot/utils/constants/order';
import { getProfit } from '@fishbot/utils/helpers/order';
import type { Order } from '@fishbot/utils/types/Order.model';
import _ from 'lodash';
import moment from 'moment';

import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';

function TodayOrders() {
  const {
    providerId,
    asset = 'USD',
  } = storeUser.useStore((state) => ({
    providerId: state.activeProvider?._id,
    asset: state.activeProvider?.asset,
  }));
  const startOfDay = moment.utc().startOf('d');
  const todayOrders = storeOrders.useStore((state) => (
    _.filter(state, (order) => order.providerId === providerId
      && order.status === OrderStatus.closed
      && moment(order.createdAt) >= startOfDay)
  ));

  const sortedTodayOrders = _.sortBy(todayOrders, 'updatedAt');

  if (!sortedTodayOrders.length) return null;

  const renderOrder = (order: Order) => {
    const profit = _.round(getProfit([order], {}, asset), 2);
    return (
      <Icon
        key={order._id}
        name="BatteryFull"
        color={profit >= 0 ? 'green' : 'red'}
        tooltip={`${order.symbol} ${profit} (${moment(order.updatedAt).fromNow()})`}
      />
    );
  };

  return (
    <Group spacing={0}>
      {sortedTodayOrders.map(renderOrder)}
    </Group>
  );
}

export default TodayOrders;
