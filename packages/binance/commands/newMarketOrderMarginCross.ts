import { OrderType } from '~constants/binanceApi';
import type { ConnectionType } from '~types/Connection.model';
import { sendRequest } from '~utils/url';

async function newMarketOrderMarginCross(
  connection: ConnectionType,
  symbol: string,
  side: string,
  quantity: number,
  price: number,
) {
  const data = await sendRequest({
    method: 'post',
    url: `https://api.binance.com/sapi/v1/margin/order?symbol=${symbol}&side=${side}&type=${OrderType.MARKET}&quantity=${quantity}&price=${price}&timeInForce=GTC&timestamp={{timestamp}}&signature={{signature}}`,
    clientId: connection.clientId,
    clientSecret: connection.clientSecret,
  });
  /*
  {
    "symbol": "BTCUSDT",
    "orderId": 28,
    "orderListId": -1, //Unless OCO, value will be -1
    "clientOrderId": "6gCrw2kRUAF9CvJDGP16IP",
    "transactTime": 1507725176595,
    "price": "0.00000000",
    "origQty": "10.00000000",
    "executedQty": "10.00000000",
    "cummulativeQuoteQty": "10.00000000",
    "status": "FILLED",
    "timeInForce": "GTC",
    "type": "MARKET",
    "side": "SELL"
  }
  */
  return data;
}

export default newMarketOrderMarginCross;
