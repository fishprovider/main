import type { ConnectionType } from '~types/Connection.model';
import { sendRequest } from '~utils/url';

async function removeOrderMarginCross(connection: ConnectionType, symbol: string, orderId: string) {
  const data = await sendRequest({
    method: 'delete',
    url: `https://api.binance.com/sapi/v1/margin/order?symbol=${symbol}&orderId=${orderId}&timestamp={{timestamp}}&signature={{signature}}`,
    clientId: connection.clientId,
    clientSecret: connection.clientSecret,
  });
  /*
  {
    "symbol": "LTCBTC",
    "orderId": 28,
    "origClientOrderId": "myOrder1",
    "clientOrderId": "cancelMyOrder1",
    "price": "1.00000000",
    "origQty": "10.00000000",
    "executedQty": "8.00000000",
    "cummulativeQuoteQty": "8.00000000",
    "status": "CANCELED",
    "timeInForce": "GTC",
    "type": "LIMIT",
    "side": "SELL"
  }
  */
  return data;
}

export default removeOrderMarginCross;
