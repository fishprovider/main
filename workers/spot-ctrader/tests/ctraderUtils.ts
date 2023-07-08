import type { Config } from '@fishprovider/ctrader/types/Config.model';
import type { ConnectionType } from '@fishprovider/ctrader/types/Connection.model';
import type { CallbackPayload } from '@fishprovider/ctrader/types/Event.model';
import connect from '@fishprovider/swap/libs/ctrader/connect';
import { ProviderType } from '@fishprovider/utils/constants/account';
import delay from '@fishprovider/utils/helpers/delay';
import { jest } from '@jest/globals';

import onEvent, { destroy as destroyEventHandler, start as startEventHandler } from '~services/events';
import * as handleEventPrice from '~services/events/handleEventPrice';

let connection: ConnectionType | undefined;

const waitForSpyObjCalled = async (spyObj: any) => {
  Logger.debug('waitForSpyObjCalled start', spyObj.mock.results);
  let isCalled = spyObj.mock.results.length > 0;
  while (!isCalled) {
    Logger.debug('waitForSpyObjCalled wait', spyObj.mock.results.length);
    await delay(500);
    isCalled = spyObj.mock.results.length > 0;
  }

  const res = await spyObj.mock.results[0]?.value;
  Logger.debug('waitForSpyObjCalled end', spyObj.mock.results, res);
  return res;
};

const testConnection = async (
  handler: (_: ConnectionType) => Promise<void>,
  config: Config,
  expects?: {
    handleEventPrice?: number;
  },
  handlerFinally?: (_: ConnectionType) => Promise<void>,
) => {
  const spyObjs: {
    handleEventPrice?: any;
  } = {};
  if (expects?.handleEventPrice) {
    spyObjs.handleEventPrice = jest.spyOn(handleEventPrice, 'default');
  }

  await startEventHandler();
  connection = await connect({
    providerId: 'testConnection',
    config,
    onEvent: (payload: CallbackPayload) => onEvent({
      providerType: ProviderType.icmarkets,
      payload,
      getConnection: () => connection,
      onAppDisconnect: async () => undefined,
      onAccountDisconnect: async () => undefined,
      onTokenInvalid: async () => undefined,
    }),
    onError: (err: any) => console.error('testConnection error', err),
    onClose: () => console.log('testConnection closed'),
  });

  try {
    await handler(connection);

    if (spyObjs.handleEventPrice) {
      const spyRes = await waitForSpyObjCalled(spyObjs.handleEventPrice);
      expect(spyRes).toEqual(expects?.handleEventPrice || 'unknown');
    }
  } finally {
    if (handlerFinally) {
      await handlerFinally(connection);
    }
    await destroyEventHandler();
    await connection.destroy();
  }
};

export {
  testConnection,
};
