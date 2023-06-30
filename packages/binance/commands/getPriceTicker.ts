import { sendRequest } from '~utils/url';

async function getPriceTicker(symbol: string) {
  const data = await sendRequest({
    url: `https://api.binance.com/api/v3/ticker/price?${symbol ? `symbol=${symbol}` : ''}`,
  });
  /*
  [
    { symbol: 'ETHBTC', price: '0.07135200' },
    { symbol: 'LTCBTC', price: '0.00321300' },
    { symbol: 'BNBBTC', price: '0.00984900' },
    { symbol: 'NEOBTC', price: '0.00053700' },
    { symbol: 'QTUMETH', price: '0.00236700' },
    { symbol: 'EOSETH', price: '0.00086300' },
    { symbol: 'SNTETH', price: '0.00002161' },
    { symbol: 'BNTETH', price: '0.00090200' },
    { symbol: 'BCCBTC', price: '0.07908100' },
    { symbol: 'GASBTC', price: '0.00012870' },
    { symbol: 'BNBETH', price: '0.13800000' },
    { symbol: 'BTCUSDT', price: '44099.12000000' },
    { symbol: 'ETHUSDT', price: '3146.75000000' },
    ...2000 more items
  ]
  */
  return data;
}

export default getPriceTicker;
