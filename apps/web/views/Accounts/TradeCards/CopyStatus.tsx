import storeAccounts from '@fishbot/cross/stores/accounts';
import storeOrders from '@fishbot/cross/stores/orders';
import { OrderStatus } from '@fishbot/utils/constants/order';
import _ from 'lodash';

import Icon from '~ui/core/Icon';

interface Props {
  providerId: string,
}

function CopyStatus({
  providerId,
}: Props) {
  const {
    parents = {},
  } = storeAccounts.useStore((state) => ({
    parents: state[providerId]?.settings?.parents,
  }));
  const parentIds = Object.keys(parents).reduce<Record<string, boolean>>(
    (acc, key) => ({ ...acc, [key]: parents[key]?.enableCopy || false }),
    {},
  );

  const parentOrders = storeOrders.useStore((state) => _.filter(
    state,
    (item) => !!parentIds[item.providerId] && item.status === OrderStatus.live,
  ));
  const orders = storeOrders.useStore((state) => _.filter(
    state,
    (item) => item.providerId === providerId && item.status === OrderStatus.live,
  ));

  const diffOrders = _.differenceBy(parentOrders, orders, (item) => item._id);
  const isSynced = !diffOrders.length;
  const tooltip = isSynced ? '(Synced)' : `(Missing ${diffOrders.length} orders))`;

  return (
    <Icon
      name="Cyclone"
      button
      tooltip={`Copying ${tooltip}`}
      color={isSynced ? 'green' : 'orange'}
      onClick={(e: React.SyntheticEvent) => e.preventDefault()}
    />
  );
}

export default CopyStatus;
