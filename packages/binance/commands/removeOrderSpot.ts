import type { ConnectionType } from '~types/Connection.model';
import { sendRequest } from '~utils/url';

async function removeOrderSpot(connection: ConnectionType, symbol: string, orderId: string) {
  const data = await sendRequest({
    method: 'delete',
    url: `https://api.binance.com/api/v3/order?symbol=${symbol}&orderId=${orderId}&timestamp={{timestamp}}&signature={{signature}}`,
    clientId: connection.clientId,
    clientSecret: connection.clientSecret,
  });
  /*
  {
    "symbol": "LTCBTC",
    "origClientOrderId": "myOrder1",
    "orderId": 4,
    "orderListId": -1, //Unless part of an OCO, the value will always be -1.
    "clientOrderId": "cancelMyOrder1",
    "price": "2.00000000",
    "origQty": "1.00000000",
    "executedQty": "0.00000000",
    "cummulativeQuoteQty": "0.00000000",
    "status": "CANCELED",
    "timeInForce": "GTC",
    "type": "LIMIT",
    "side": "BUY"
  }
  */
  return data;
}

export default removeOrderSpot;
