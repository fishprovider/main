import storePrices from '@fishbot/cross/stores/prices';
import { OrderStatus } from '@fishbot/utils/constants/order';
import type { Order } from '@fishbot/utils/types/Order.model';
import _ from 'lodash';
import moment from 'moment';

import Avatar from '~ui/core/Avatar';
import Group from '~ui/core/Group';
import Tooltip from '~ui/core/Tooltip';

import OrderAlarm from './OrderAlarm';
import OrderChat from './OrderChat';
import OrderConfidence from './OrderConfidence';

interface Props {
  order: Order;
}

function OrderActivities({ order }: Props) {
  const priceDoc = storePrices.useStore((prices) => prices[`${order.providerType}-${order.symbol}`]);
  const {
    digits = 0,
  } = priceDoc || {};

  let mergedLog = order.updatedLogs?.[0];

  const transform = (log: Record<string, any>) => {
    const isEvent = log.sourceType === 'event';
    mergedLog = {
      ...mergedLog,
      ...(isEvent ? _.omit(log, ['userId', 'userEmail', 'userName', 'userPicture']) : log),
    };

    const {
      userName, userPicture, updatedAt, price,
      stopLoss = '-',
      takeProfit = '-',
    } = mergedLog;

    const messages = [
      `Updated by ${userName} at ${moment(updatedAt)} (${moment(updatedAt).fromNow()})`,
      `Entry ${price}`,
      `SL ${_.round(stopLoss, digits)}`,
      `TP ${_.round(takeProfit, digits)}`,
      ...(log.status === OrderStatus.closed ? [`Close ${order.priceClose}`] : []),
      `[${log.tag}]`,
    ];

    return {
      ...log,
      userPicture,
      msg: messages.join(', '),
    } as Record<string, any>;
  };

  const logs = order.updatedLogs?.map((log) => transform(log))
    .filter((log) => {
      const { tag, sourceType } = log;
      return tag !== 'newOrder' && ['user', 'system'].includes(sourceType);
    });

  return (
    <Group spacing="xs">
      <OrderConfidence order={order} />
      <OrderChat order={order} />
      <OrderAlarm order={order} />
      <Group spacing={0} maw={200} mah={100} sx={{ overflow: 'scroll' }}>
        {logs?.map((log, index) => (
          <Tooltip key={index} label={log.msg}>
            <Avatar size="sm" src={log.userPicture} alt={log.userId} />
          </Tooltip>
        ))}
      </Group>
    </Group>
  );
}

export default OrderActivities;
