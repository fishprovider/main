import storeOrders from '@fishprovider/cross/dist/stores/orders';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';
import _ from 'lodash';

import { watchUserInfoController } from '~controllers/user.controller';
import Stack from '~ui/Stack';

import ListTradeLive from './ListTradeLive';
import ListTradePending from './ListTradePending';

function ListTrade() {
  const providerId = watchUserInfoController((state) => state.activeAccount?._id);
  const trades = storeOrders.useStore((state) => _.filter(
    state,
    (item) => item.providerId === providerId
      && [OrderStatus.live, OrderStatus.pending].includes(item.status),
  ));

  return (
    <Stack space="$4">
      <ListTradeLive orders={trades.filter((item) => item.status === OrderStatus.live)} />
      <ListTradePending orders={trades.filter((item) => item.status === OrderStatus.pending)} />
    </Stack>
  );
}

export default ListTrade;
