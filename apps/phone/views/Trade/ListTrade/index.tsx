import storeOrders from '@fishprovider/cross/dist/stores/orders';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';
import _ from 'lodash';

import Stack from '~ui/Stack';

import ListTradeLive from './ListTradeLive';
import ListTradePending from './ListTradePending';

function ListTrade() {
  const providerId = storeUser.useStore((state) => state.activeProvider?._id);
  const trades = storeOrders.useStore((state) => _.filter(
    state,
    (item) => item.providerId === providerId
      && [OrderStatus.live, OrderStatus.pending].includes(item.status),
  ));

  return (
    <Stack>
      <ListTradeLive orders={trades.filter((item) => item.status === OrderStatus.live)} />
      <ListTradePending orders={trades.filter((item) => item.status === OrderStatus.pending)} />
    </Stack>
  );
}

export default ListTrade;
