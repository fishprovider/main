import storeUser from '@fishprovider/cross/dist/stores/user';

import OrdersWatch from './OrdersWatch';

function TradeWatch() {
  const {
    providerId = '',
  } = storeUser.useStore((state) => ({
    providerId: state.activeProvider?._id,
  }));

  return (
    <OrdersWatch providerId={providerId} />
  );
}

export default TradeWatch;
