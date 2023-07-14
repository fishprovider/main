import storeUser from '@fishprovider/cross/dist/stores/user';
import { ProviderType } from '@fishprovider/utils/dist/constants/account';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';

import PriceWatch from '~components/price/PriceWatch';
import HistoryWatch from '~views/Account/AccountContent/History/HistoryWatch';

import NewsWatch from './NewsWatch';
import OrdersWatch from './OrdersWatch';

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
      <HistoryWatch />
      <PriceWatch
        providerId={providerId}
        providerType={providerType}
        activeSymbol={activeSymbol}
        orderStatuses={[OrderStatus.live, OrderStatus.pending]}
      />
      <NewsWatch />
    </>
  );
}

export default TradeWatch;
