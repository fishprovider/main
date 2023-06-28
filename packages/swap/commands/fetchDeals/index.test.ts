import { ProviderPlatform, ProviderType } from '@fishbot/utils/constants/account';

import { afterAllSetup, beforeAllSetup, getConfig } from '~tests/utils';

import fetchDeals from '.';

beforeAll((done) => {
  beforeAllSetup(done);
});

afterAll((done) => {
  afterAllSetup(done);
});

describe('fetchDeals', () => {
  test('ctrader days', async () => {
    const config = await getConfig('ctrader');
    const { deals } = await fetchDeals({
      providerId: 'ctrader',
      providerType: ProviderType.icmarkets,
      providerPlatform: ProviderPlatform.ctrader,
      options: {
        config,
        days: 1,
      },
    });
    Logger.info('Got deals:', deals.length);
  });

  test('ctrader weeks', async () => {
    const config = await getConfig('ctrader');
    const { deals } = await fetchDeals({
      providerId: 'ctrader',
      providerType: ProviderType.icmarkets,
      providerPlatform: ProviderPlatform.ctrader,
      options: {
        config,
        weeks: 1,
      },
    });
    Logger.info('Got deals:', deals.length);
  });

  test('metatrader days', async () => {
    const config = await getConfig('meta');
    const { deals } = await fetchDeals({
      providerId: 'meta',
      providerType: ProviderType.exness,
      providerPlatform: ProviderPlatform.ctrader,
      options: {
        config,
        days: 1,
      },
    });
    Logger.info('Got deals:', deals.length);
  });

  test('metatrader weeks', async () => {
    const config = await getConfig('meta');
    const { deals } = await fetchDeals({
      providerId: 'meta',
      providerType: ProviderType.exness,
      providerPlatform: ProviderPlatform.ctrader,
      options: {
        config,
        weeks: 1,
      },
    });
    Logger.info('Got deals:', deals.length);
  });
});
