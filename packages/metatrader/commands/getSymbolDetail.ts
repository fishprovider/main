import type { MetatraderSymbolSpecification } from 'metaapi.cloud-sdk';

import type { ConnectionType } from '~types/Connection.model';
import { sendRequest } from '~utils/url';

/*
{
  symbol: 'EURUSD',
  tickSize: 0.00001,
  fillingModes: [ 'SYMBOL_FILLING_FOK' ],
  contractSize: 100000,
  quoteSessions: {
    SUNDAY: [ [Object] ],
    MONDAY: [ [Object] ],
    TUESDAY: [ [Object] ],
    WEDNESDAY: [ [Object] ],
    THURSDAY: [ [Object] ],
    FRIDAY: [ [Object] ],
    SATURDAY: []
  },
  tradeSessions: {
    SUNDAY: [ [Object] ],
    MONDAY: [ [Object] ],
    TUESDAY: [ [Object] ],
    WEDNESDAY: [ [Object] ],
    THURSDAY: [ [Object] ],
    FRIDAY: [ [Object] ],
    SATURDAY: []
  },
  initialMargin: 0,
  maintenanceMargin: 0,
  hedgedMargin: 0,
  hedgedMarginUsesLargerLeg: false,
  priceCalculationMode: 'SYMBOL_CALC_MODE_FOREX',
  marginCurrency: 'EUR',
  baseCurrency: 'EUR',
  swapMode: 'SYMBOL_SWAP_MODE_POINTS',
  allowedExpirationModes: [ 'SYMBOL_EXPIRATION_SPECIFIED' ],
  allowedOrderTypes: [
    'SYMBOL_ORDER_MARKET',
    'SYMBOL_ORDER_LIMIT',
    'SYMBOL_ORDER_STOP',
    'SYMBOL_ORDER_SL',
    'SYMBOL_ORDER_TP',
    'SYMBOL_ORDER_CLOSEBY'
  ],
  digits: 5,
  description: 'Euro vs US Dollar',
  stopsLevel: 0,
  freezeLevel: 0,
  swapLong: -6.2,
  swapShort: 0,
  swapRollover3Days: 'WEDNESDAY',
  minVolume: 0.01,
  maxVolume: 200,
  volumeStep: 0.01,
  executionMode: 'SYMBOL_TRADE_EXECUTION_REQUEST',
  tradeMode: 'SYMBOL_TRADE_MODE_FULL',
  pipSize: 0.0001,
  lotSize: 100000
}
*/

const getSymbolDetail = async (
  connection: ConnectionType,
  symbol: string,
  accountId?: string,
) => {
  const res = await sendRequest<MetatraderSymbolSpecification>({
    url: `/users/current/accounts/${accountId || connection.accountId}/symbols/${symbol}/specification`,
    clientSecret: connection.clientSecret,
  });

  return res;
};

export default getSymbolDetail;
