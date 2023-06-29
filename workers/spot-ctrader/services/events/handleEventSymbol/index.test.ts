import { CallbackType } from '@fishbot/ctrader/constants/openApi';
import type { Config } from '@fishbot/ctrader/types/Config.model';
import type { ConnectionType } from '@fishbot/ctrader/types/Connection.model';
import { getSymbols } from '@fishbot/swap/utils/price';
import { ProviderType } from '@fishbot/utils/constants/account';
import { jest } from '@jest/globals';

import { testConnection } from '~tests/ctraderUtils';
import { afterAllSetup, beforeAllSetup, getConfig } from '~tests/utils';

import handleEventSymbol from '.';

let config: Config;

beforeAll((done) => {
  beforeAllSetup(done, async () => {
    config = await getConfig() as Config;
  });
});

afterAll((done) => {
  afterAllSetup(done);
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('handleEventSymbol', async () => {
  const { symbolNames } = await getSymbols(ProviderType.icmarkets);
  const symbolId = symbolNames.EURUSD?.symbolId;

  await testConnection(
    async (connection: ConnectionType) => {
      await handleEventSymbol(
        ProviderType.icmarkets,
        { type: CallbackType.symbol, symbolId },
        () => connection,
      );
    },
    config,
  );
});
