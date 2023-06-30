/* eslint-disable no-param-reassign */
import WebSocket from 'ws';

import type { ConnectionType } from '~types/Connection.model';
import { sendRequest } from '~utils/url';

async function subMargin(connection: ConnectionType) {
  const listenKeyRes = await sendRequest({
    method: 'post',
    url: 'https://api.binance.com/sapi/v1/userDataStream?timestamp={{timestamp}}&signature={{signature}}',
    clientId: connection.clientId,
    clientSecret: connection.clientSecret,
  });
  connection.listenKey = listenKeyRes.listenKey;

  await new Promise((resolve, reject) => {
    connection.socket = new WebSocket(`wss://stream.binance.com:9443/ws/${connection.listenKey}`);

    connection.socket.on('open', () => {
      Logger.debug(`Connected ${connection.name}`);

      resolve(true);
    });

    connection.socket.on('error', (error) => {
      Logger.error(`Connection error ${connection.name}`, error);

      connection.onError(error);
      reject(error);
    });

    connection.socket.on('close', (code, reason) => {
      Logger.debug(`Connection closed ${connection.name}`, code, reason);

      if (connection.destroyPromise) {
        connection.destroyPromise.resolveExec();
      }
      connection.onClose();
    });

    connection.socket.on('message', (data) => {
      /* eslint-disable max-len */
      /*
      borrow + open limit
      {"e":"balanceUpdate","E":1644385612267,"a":"USDT","d":"100.00000000","T":1644385612267}
      {"e":"outboundAccountPosition","E":1644385612267,"u":1644385612267,"B":[{"a":"USDT","f":"100.00000000","l":"0.00000000"}]}
      {"e":"executionReport","E":1644385612452,"s":"MATICUSDT","c":"android_347fe920b39b4d6a98dbe2725b28","S":"BUY","o":"LIMIT","f":"GTC","q":"100.00000000","p":"1.00000000","P":"0.00000000","F":"0.00000000","g":-1,"C":"","x":"NEW","X":"NEW","r":"NONE","i":1644622962,"l":"0.00000000","z":"0.00000000","L":"0.00000000","n":"0","N":null,"T":1644385612451,"t":-1,"I":3522441672,"w":true,"m":false,"M":false,"O":1644385612451,"Z":"0.00000000","Y":"0.00000000","Q":"0.00000000"}
      {"e":"outboundAccountPosition","E":1644385612452,"u":1644385612451,"B":[{"a":"BNB","f":"0.00000510","l":"0.00000000"},{"a":"USDT","f":"0.00000000","l":"100.00000000"},{"a":"MATIC","f":"528.44620000","l":"0.00000000"}]}

      close limit + repay
      {"e":"executionReport","E":1644385621882,"s":"MATICUSDT","c":"and_41bc800bf5c1483f87322e6cc4593d48","S":"BUY","o":"LIMIT","f":"GTC","q":"100.00000000","p":"1.00000000","P":"0.00000000","F":"0.00000000","g":-1,"C":"android_347fe920b39b4d6a98dbe2725b28","x":"CANCELED","X":"CANCELED","r":"NONE","i":1644622962,"l":"0.00000000","z":"0.00000000","L":"0.00000000","n":"0","N":null,"T":1644385621882,"t":-1,"I":3522443023,"w":false,"m":false,"M":false,"O":1644385612451,"Z":"0.00000000","Y":"0.00000000","Q":"0.00000000"}
      {"e":"outboundAccountPosition","E":1644385621882,"u":1644385621882,"B":[{"a":"BNB","f":"0.00000510","l":"0.00000000"},{"a":"USDT","f":"100.00000000","l":"0.00000000"},{"a":"MATIC","f":"528.44620000","l":"0.00000000"}]}
      {"e":"balanceUpdate","E":1644385622129,"a":"USDT","d":"-100.00000000","T":1644385622128}
      {"e":"outboundAccountPosition","E":1644385622129,"u":1644385622128,"B":[{"a":"USDT","f":"0.00000000","l":"0.00000000"}]}

      transfer out
      {
        e: 'balanceUpdate',
        E: 1644386086100,
        a: 'ADA',
        d: '-100.00000000',
        T: 1644386086100
      }
      {
        e: 'outboundAccountPosition',
        E: 1644386086100,
        u: 1644386086100,
        B: [ { a: 'ADA', f: '4544.11316100', l: '0.00000000' } ]
      }

      transfer in
      {
        e: 'balanceUpdate',
        E: 1644386157240,
        a: 'ADA',
        d: '100.00000000',
        T: 1644386157239
      }
      {
        e: 'outboundAccountPosition',
        E: 1644386157240,
        u: 1644386157239,
        B: [ { a: 'ADA', f: '4644.11316100', l: '0.00000000' } ]
      }
      */
      /* eslint-enable max-len */
      connection.onEvent(data);
    });
  });

  connection.pingInterval = setInterval(() => {
    sendRequest({
      method: 'put',
      url: `https://api.binance.com/sapi/v1/userDataStream?listenKey=${connection.listenKey}&timestamp={{timestamp}}&signature={{signature}}`,
      clientId: connection.clientId,
      clientSecret: connection.clientSecret,
    }).catch((error) => {
      Logger.error('Failed to ping', error);
    });
  }, 1000 * 60 * 30);
}

export default subMargin;
