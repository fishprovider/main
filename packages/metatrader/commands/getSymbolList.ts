import type { ConnectionType } from '~types/Connection.model';
import { sendRequest } from '~utils/url';

/*
[
  'AAPL',   'ABBV',   'ABT',    'ADAUSD', 'ADBE',   'ADP',
  'AMD',    'AMGN',   'AMT',    'AMZN',   'ATVI',   'AUDCAD',
  'AUDCHF', 'AUDCZK', 'AUDDKK', 'AUDHKX', 'AUDHUF', 'AUDJPX',
  'AUDJPY', 'AUDMXN', 'AUDNOK', 'AUDNZD', 'AUDPLN', 'AUDSEK',
  'AUDSGD', 'AUDTRY', 'AUDUSD', 'AUDUSX', 'AUDZAR', 'AUS200',
  'AUXAUD', 'AUXTHB', 'AUXUSD', 'AUXZAR', 'AVGO',   'BA',
  'BABA',   'BAC',    'BATUSD', 'BCHUSD', 'BIIB',   'BMY',
  'BNBUSD', 'BTCAUD', 'BTCCNH', 'BTCJPY', 'BTCKRW', 'BTCTHB',
  'BTCUSD', 'BTCXAG', 'BTCXAU', 'BTCZAR', 'C',      'CADCHF',
  'CADCZK', 'CADJPY', 'CADMXN', 'CADNOK', 'CADPLN', 'CADTRY',
  'CHFDKK', 'CHFHUF', 'CHFJPY', 'CHFMXN', 'CHFNOK', 'CHFPLN',
  'CHFSEK', 'CHFSGD', 'CHFTRY', 'CHFZAR', 'CHTR',   'CMCSA',
  'CME',    'COST',   'CSCO',   'CSX',    'CVS',    'CZKPLN',
  'DE30',   'DKKCZK', 'DKKHUF', 'DKKJPY', 'DKKPLN', 'DKKSGD',
  'DKKZAR', 'DOTUSD', 'DXY',    'EA',     'EBAY',   'ENJUSD',
  'EQIX',   'ETHUSD', 'EURAUD', 'EURAUX', 'EURCAD', 'EURCHF',
  'EURCZK', 'EURDKK', 'EURGBP', 'EURGBX',
  ... 313 more items
]
*/

const getSymbolList = async (
  connection: ConnectionType,
  accountId?: string,
) => {
  const res = await sendRequest<string[]>({
    url: `/users/current/accounts/${accountId || connection.accountId}/symbols`,
    clientSecret: connection.clientSecret,
  });
  return res;
};

export default getSymbolList;
