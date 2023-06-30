import type { ConnectionType } from '~types/Connection.model';
import { sendRequest } from '~utils/url';

async function getAccountInfoMarginIsolated(connection: ConnectionType) {
  const data = await sendRequest({
    url: 'https://api.binance.com/sapi/v1/margin/isolated/account?timestamp={{timestamp}}&signature={{signature}}',
    clientId: connection.clientId,
    clientSecret: connection.clientSecret,
  });
  /* eslint-disable max-len */
  /*
  {
    "assets":[
      {
        "baseAsset":
        {
          "asset": "BTC",
          "borrowEnabled": true,
          "borrowed": "0.00000000",
          "free": "0.00000000",
          "interest": "0.00000000",
          "locked": "0.00000000",
          "netAsset": "0.00000000",
          "netAssetOfBtc": "0.00000000",
          "repayEnabled": true,
          "totalAsset": "0.00000000"
        },
        "quoteAsset":
        {
          "asset": "USDT",
          "borrowEnabled": true,
          "borrowed": "0.00000000",
          "free": "0.00000000",
          "interest": "0.00000000",
          "locked": "0.00000000",
          "netAsset": "0.00000000",
          "netAssetOfBtc": "0.00000000",
          "repayEnabled": true,
          "totalAsset": "0.00000000"
        },
        "symbol": "BTCUSDT",
        "isolatedCreated": true,
        "enabled": true, // true-enabled, false-disabled
        "marginLevel": "0.00000000",
        "marginLevelStatus": "EXCESSIVE", // "EXCESSIVE", "NORMAL", "MARGIN_CALL", "PRE_LIQUIDATION", "FORCE_LIQUIDATION"
        "marginRatio": "0.00000000",
        "indexPrice": "10000.00000000",
        "liquidatePrice": "1000.00000000",
        "liquidateRate": "1.00000000",
        "tradeEnabled": true
      }
    ],
    "totalAssetOfBtc": "0.00000000",
    "totalLiabilityOfBtc": "0.00000000",
    "totalNetAssetOfBtc": "0.00000000"
  }
  */
  /* eslint-enable max-len */
  return {
    ...data,
    marginLevel: +data.marginLevel,
    totalAssetOfBtc: +data.totalAssetOfBtc,
    totalLiabilityOfBtc: +data.totalLiabilityOfBtc,
    totalNetAssetOfBtc: +data.totalNetAssetOfBtc,
    userAssets: data.userAssets?.filter((item: any) => +item.netAsset)
      .map((item: any) => ({
        ...item,
        borrowed: +item.borrowed,
        free: +item.free,
        interest: +item.interest,
        locked: +item.locked,
        netAsset: +item.netAsset,
      })),
  };
}

export default getAccountInfoMarginIsolated;
