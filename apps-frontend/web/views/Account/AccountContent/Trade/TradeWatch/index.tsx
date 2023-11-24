import { AccountType } from '@fishprovider/core';
import { OrderStatus } from '@fishprovider/utils/dist/constants/order';

import PriceWatch from '~components/price/PriceWatch';
import { watchUserInfoController } from '~controllers/user.controller';
import HistoryWatch from '~views/Account/AccountContent/History/HistoryWatch';

import NewsWatch from './NewsWatch';
import OrdersWatch from './OrdersWatch';

function TradeWatch() {
  const {
    accountId,
    activeSymbol = 'AUDUSD',
    accountType = AccountType.icmarkets,
  } = watchUserInfoController((state) => ({
    accountId: state.activeAccount?._id,
    accountType: state.activeAccount?.accountType,
    activeSymbol: state.activeSymbol,
  }));

  return (
    <>
      {accountId && <OrdersWatch accountId={accountId} />}
      <HistoryWatch />
      {accountId && (
        <PriceWatch
          accountId={accountId}
          accountType={accountType}
          activeSymbol={activeSymbol}
          orderStatuses={[OrderStatus.live, OrderStatus.pending]}
        />
      )}
      <NewsWatch />
    </>
  );
}

export default TradeWatch;
