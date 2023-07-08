import { ProviderPlatform, ProviderType } from '@fishprovider/utils/constants/account';

import { afterAllSetup, beforeAllSetup, getConfig } from '~tests/utils';

import fetchOrders from '.';

beforeAll((done) => {
  beforeAllSetup(done);
});

afterAll((done) => {
  afterAllSetup(done);
});

describe('fetchOrders', () => {
  test('ctrader', async () => {
    const config = await getConfig('ctrader');
    const { orders, positions } = await fetchOrders({
      providerId: 'ctrader',
      providerType: ProviderType.icmarkets,
      providerPlatform: ProviderPlatform.ctrader,
      options: { config },
    });
    Logger.info('Got orders:', orders?.length);
    Logger.info('Got positions:', positions?.length);
    expect(orders?.length).toBeDefined();
    expect(positions?.length).toBeDefined();
  });

  test('metatrader', async () => {
    const config = await getConfig('meta');
    const { orders, positions } = await fetchOrders({
      providerId: 'meta',
      providerType: ProviderType.exness,
      providerPlatform: ProviderPlatform.ctrader,
      options: { config },
    });
    Logger.info('Got orders:', orders?.length);
    Logger.info('Got positions:', positions?.length);
    expect(orders?.length).toBeDefined();
    expect(positions?.length).toBeDefined();
  });
});
