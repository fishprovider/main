import type { ConnectionType } from '~types/Connection.model';
import { sendRequest } from '~utils/url';

async function getAccountInfoSpot(connection: ConnectionType) {
  const data = await sendRequest({
    url: 'https://api.binance.com/api/v3/account?timestamp={{timestamp}}&signature={{signature}}',
    clientId: connection.clientId,
    clientSecret: connection.clientSecret,
  });
  /*
  {
    makerCommission: 10,
    takerCommission: 10,
    buyerCommission: 0,
    sellerCommission: 0,
    canTrade: true,
    canWithdraw: true,
    canDeposit: true,
    brokered: false,
    updateTime: 1666698036623,
    accountType: 'SPOT',
    balances: [
      { asset: 'JEX', free: 24.96716297, locked: 0 },
      { asset: 'LUNA', free: 39.24864764, locked: 0 },
      { asset: 'SGB', free: 1511.00140428, locked: 0 },
      { asset: 'SOLO', free: 7.77092529, locked: 0 },
      { asset: 'USTC', free: 5351.712203, locked: 0 },
      { asset: 'ETHW', free: 1.67594258, locked: 0 }
    ],
    permissions: [ 'SPOT' ]
  }
  */
  return {
    ...data,
    balances: data.balances
      .filter((item: any) => +item.free || +item.locked)
      .map((item: any) => ({
        ...item,
        free: +item.free,
        locked: +item.locked,
      })),
  };
}

export default getAccountInfoSpot;
