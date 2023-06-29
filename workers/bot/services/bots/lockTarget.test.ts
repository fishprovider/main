import type { Config } from '@fishbot/ctrader/types/Config.model';
import fetchAccountInfo from '@fishbot/swap/commands/fetchAccountInfo';
import fetchOrders from '@fishbot/swap/commands/fetchOrders';
// import * as updatePosition from '@fishbot/swap/commands/updatePosition';
import { ProviderPlatform, ProviderType } from '@fishbot/utils/constants/account';

import * as provider from '~services/provider';
import {
  afterAllSetup, beforeAllSetup, getConfig, testMarketOrder,
} from '~tests/utils';

const env = {
  typeId: process.env.TYPE_ID || '',
};

let config: Config;

beforeAll((done) => {
  beforeAllSetup(done, async () => {
    config = await getConfig() as Config;
  });
});

afterAll((done) => {
  afterAllSetup(done);
});

test('lockTarget', async () => {
  await testMarketOrder(async () => {
    await fetchOrders({
      providerId: env.typeId,
      providerType: ProviderType.icmarkets,
      providerPlatform: ProviderPlatform.ctrader,
      options: { config },
    });
    await fetchAccountInfo({
      providerId: env.typeId,
      providerType: ProviderType.icmarkets,
      providerPlatform: ProviderPlatform.ctrader,
      options: { config },
    });

    // const spyObj = jest.spyOn(updatePosition, 'default');

    await provider.runBots();

    // await waitForSpyObjCalled(spyObj);
    // expect(spyObj).toHaveBeenCalled();
  }, config);
});
