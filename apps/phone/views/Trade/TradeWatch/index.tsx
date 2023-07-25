import storeUser from '@fishprovider/cross/dist/stores/user';
import { ProviderType } from '@fishprovider/utils/dist/constants/account';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';

import OrdersWatch from './OrdersWatch';
import PriceWatch from './PriceWatch';

function TradeWatch() {
  const {
    providerId = '',
    activeSymbol,
    providerType = ProviderType.icmarkets,
  } = storeUser.useStore((state) => ({
    providerId: state.activeProvider?._id,
    providerType: state.activeProvider?.providerType,
    activeSymbol: state.activeSymbol,
  }));

  return (
    <>
      <OrdersWatch providerId={providerId} />
      <PriceWatch
        providerId={providerId}
        providerType={providerType}
        activeSymbol={activeSymbol}
        orderStatuses={[OrderStatus.live, OrderStatus.pending]}
      />
    </>
  );
}

export default TradeWatch;
