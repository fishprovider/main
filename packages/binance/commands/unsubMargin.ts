/* eslint-disable no-param-reassign */
import promiseCreator from '@fishprovider/utils/helpers/promiseCreator';

import type { ConnectionType } from '~types/Connection.model';
import { sendRequest } from '~utils/url';

async function unsubMargin(connection: ConnectionType) {
  if (connection.pingInterval) {
    clearInterval(connection.pingInterval);
  }

  if (connection.socket) {
    connection.destroyPromise = promiseCreator();
    connection.socket.close();
    await connection.destroyPromise;
    delete connection.destroyPromise;
  }

  await sendRequest({
    method: 'delete',
    url: `https://api.binance.com/sapi/v1/userDataStream?listenKey=${connection.listenKey}&timestamp={{timestamp}}&signature={{signature}}`,
    clientId: connection.clientId,
    clientSecret: connection.clientSecret,
  });
}

export default unsubMargin;
