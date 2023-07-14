import type { Config } from '@fishprovider/ctrader/dist/types/Config.model';
import fetchOrders from '@fishprovider/swap/dist/commands/fetchOrders';
import * as newOrder from '@fishprovider/swap/dist/commands/newOrder';
import removePosition from '@fishprovider/swap/dist/commands/removePosition';
import { ProviderPlatform, ProviderType } from '@fishprovider/utils/dist/constants/account';

import * as provider from '~services/provider';
import {
  afterAllSetup, beforeAllSetup, getConfig, isMarketClosed, testMarketOrder, waitForSpyObjCalled,
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

const closeAll = async (providerId: string) => {
  const { positions } = await fetchOrders({
    providerId,
    providerType: ProviderType.icmarkets,
    providerPlatform: ProviderPlatform.ctrader,
    options: { config },
  });
  if (positions) {
    for (const order of positions) {
      await removePosition({ order, options: { config } })
        .catch((err: any) => {
          if (isMarketClosed(ProviderType.icmarkets, err.message)) {
            console.warn('Market is closed');
          } else {
            throw err;
          }
        });
    }
  }
};

test('copyNewOrders', async () => {
  await closeAll(env.typeId);
  await closeAll('copyChild');
  await closeAll('copyChildChild');

  await testMarketOrder(async () => {
    await fetchOrders({
      providerId: env.typeId,
      providerType: ProviderType.icmarkets,
      providerPlatform: ProviderPlatform.ctrader,
      options: { config },
    });

    const spyObj = jest.spyOn(newOrder, 'default');
    await provider.runCopiers();
    await waitForSpyObjCalled(spyObj);
    expect(spyObj).toHaveBeenCalled();

    await fetchOrders({
      providerId: 'copyChild',
      providerType: ProviderType.icmarkets,
      providerPlatform: ProviderPlatform.ctrader,
      options: { config },
    });

    spyObj.mockReset();
    await provider.runCopiers();
    await waitForSpyObjCalled(spyObj);
    expect(spyObj).toHaveBeenCalled();

    await fetchOrders({
      providerId: 'copyChildChild',
      providerType: ProviderType.icmarkets,
      providerPlatform: ProviderPlatform.ctrader,
      options: { config },
    });
  }, config);
});
