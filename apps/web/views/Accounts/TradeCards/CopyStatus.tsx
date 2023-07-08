import storeAccounts from '@fishprovider/cross/stores/accounts';
import storeOrders from '@fishprovider/cross/stores/orders';
import { OrderStatus } from '@fishprovider/utils/constants/order';
import { parseCopyId } from '@fishprovider/utils/helpers/order';
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
  const copyOrders = storeOrders.useStore((state) => _.filter(
    state,
    (item) => item.providerId === providerId && item.status === OrderStatus.live && !!item.copyId,
  ));

  const missingOrders = parentOrders.filter((parentItem) => !copyOrders.some(
    (item) => parentItem._id === parseCopyId(item.copyId || '').parentOrderId,
  ));
  const isSynced = !missingOrders.length;
  const tooltip = isSynced ? '(Synced)' : `(Missing ${missingOrders.length} orders)`;

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
