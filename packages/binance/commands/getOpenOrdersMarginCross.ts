import type { ConnectionType } from '~types/Connection.model';
import { sendRequest } from '~utils/url';

async function getOpenOrdersMarginCross(connection: ConnectionType) {
  const data = await sendRequest({
    url: 'https://api.binance.com/sapi/v1/margin/openOrders?timestamp={{timestamp}}&signature={{signature}}',
    clientId: connection.clientId,
    clientSecret: connection.clientSecret,
  });
  /*
  [
   {
       "clientOrderId": "qhcZw71gAkCCTv0t0k8LUK",
       "cummulativeQuoteQty": "0.00000000",
       "executedQty": "0.00000000",
       "icebergQty": "0.00000000",
       "isWorking": true,
       "orderId": 211842552,
       "origQty": "0.30000000",
       "price": "0.00475010",
       "side": "SELL",
       "status": "NEW",
       "stopPrice": "0.00000000",
       "symbol": "BNBBTC",
       "isIsolated": true,
       "time": 1562040170089,
       "timeInForce": "GTC",
       "type": "LIMIT",
       "updateTime": 1562040170089
    }
  ]
  */
  return {
    ...data,
  };
}

export default getOpenOrdersMarginCross;
