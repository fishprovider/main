import type { Config } from '@fishprovider/ctrader/dist/types/Config.model';
import fetchAccountInfo from '@fishprovider/swap/dist/commands/fetchAccountInfo';
import fetchOrders from '@fishprovider/swap/dist/commands/fetchOrders';
// import * as updatePosition from '@fishprovider/swap/dist/commands/updatePosition';
import { ProviderPlatform, ProviderType } from '@fishprovider/utils/dist/constants/account';

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
