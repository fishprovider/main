import subSpot from '@fishprovider/ctrader/dist/commands/subSpot';
import unsubSpot from '@fishprovider/ctrader/dist/commands/unsubSpot';
import type { Config } from '@fishprovider/ctrader/dist/types/Config.model';
import type { ConnectionType } from '@fishprovider/ctrader/dist/types/Connection.model';
import { getSymbols } from '@fishprovider/swap/dist/utils/price';
import { ProviderType } from '@fishprovider/utils/dist/constants/account';
import { jest } from '@jest/globals';

import { testConnection } from '~tests/ctraderUtils';
import { afterAllSetup, beforeAllSetup, getConfig } from '~tests/utils';

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

test.skip('handleEventPrice', async () => {
  const { symbolNames } = await getSymbols(ProviderType.icmarkets);
  const symbolName = 'EURUSD';
  const symbolId = symbolNames[symbolName]?.symbolId;
  if (!symbolId) {
    fail(`symbolId not found for ${symbolName}`);
  }

  await testConnection(
    async (connection: ConnectionType) => {
      await subSpot(connection, symbolId)
        .catch(() => fail(`Failed to subSpot ${symbolName}`));
    },
    config,
    {
      handleEventPrice: 1,
    },
    async (connection: ConnectionType) => {
      await unsubSpot(connection, symbolId)
        .catch(() => fail(`Failed to unsubSpot ${symbolName}`));
    },
  );
});
