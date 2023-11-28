import { ProviderType } from '@fishprovider/core';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';

import { watchUserInfoController } from '~controllers/user.controller';

import OrdersWatch from './OrdersWatch';
import PriceWatch from './PriceWatch';

function TradeWatch() {
  const {
    accountId = '',
    activeSymbol = 'AUDUSD',
    providerType = ProviderType.icmarkets,
  } = watchUserInfoController((state) => ({
    accountId: state.activeAccount?._id,
    providerType: state.activeAccount?.providerType,
    activeSymbol: state.activeSymbol,
  }));

  return (
    <>
      <OrdersWatch providerId={accountId} />
      {accountId && (
        <PriceWatch
          providerId={accountId}
          providerType={providerType}
          activeSymbol={activeSymbol}
          orderStatuses={[OrderStatus.live, OrderStatus.pending]}
        />
      )}
    </>
  );
}

export default TradeWatch;
