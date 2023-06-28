import type { MetatraderDeal } from 'metaapi.cloud-sdk';

import type { ConnectionType } from '~types/Connection.model';
import { sendRequest } from '~utils/url';

/*
{
  "id": "266126022",
  "platform": "mt4",
  "type": "ORDER_TYPE_BUY",
  "state": "ORDER_STATE_FILLED",
  "symbol": "AUDUSD",
  "magic": 0,
  "time": "2023-04-19T06:12:31.000Z",
  "brokerTime": "2023-04-19 06:12:31.000",
  "openPrice": 0.67187,
  "volume": 0.01,
  "currentVolume": 0,
  "positionId": "266126022",
  "reason": "ORDER_REASON_UNKNOWN",
  "fillingMode": "ORDER_FILLING_FOK",
  "expirationType": "ORDER_TIME_SPECIFIED",
  "doneTime": "2023-04-19T06:12:31.000Z",
  "doneBrokerTime": "2023-04-19 06:12:31.000",
  "accountCurrencyExchangeRate": 1,
  "brokerComment": "copy-66449427",
  "comment": "copy-66449427"
},
{
  "id": "266006159",
  "platform": "mt4",
  "type": "ORDER_TYPE_SELL",
  "state": "ORDER_STATE_FILLED",
  "symbol": "USDJPY",
  "magic": 0,
  "time": "2023-04-19T06:13:59.000Z",
  "brokerTime": "2023-04-19 06:13:59.000",
  "openPrice": 134.619,
  "volume": 0.01,
  "currentVolume": 0,
  "positionId": "266006159",
  "reason": "ORDER_REASON_UNKNOWN",
  "fillingMode": "ORDER_FILLING_FOK",
  "expirationType": "ORDER_TIME_SPECIFIED",
  "doneTime": "2023-04-19T06:13:59.000Z",
  "doneBrokerTime": "2023-04-19 06:13:59.000",
  "accountCurrencyExchangeRate": 1,
  "stopLoss": 134.103,
  "takeProfit": 135,
  "brokerComment": "copy-66439726",
  "comment": "copy-66439726"
},
*/

const getHistory = async (
  connection: ConnectionType,
  fromTimeISO: string, // 2023-04-18T10:00:00.000Z
  toTimeISO: string, // 2023-04-19T10:00:00.000Z
  accountId?: string,
) => {
  const res = await sendRequest<MetatraderDeal[]>({
    url: `/users/current/accounts/${accountId || connection.accountId}/history-orders/time/${fromTimeISO}/${toTimeISO}`,
    clientSecret: connection.clientSecret,
  });
  return res;
};

export default getHistory;
