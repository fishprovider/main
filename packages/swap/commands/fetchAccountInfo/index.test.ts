import { ProviderPlatform, ProviderType } from '@fishbot/utils/constants/account';

import { afterAllSetup, beforeAllSetup, getConfig } from '~tests/utils';

import fetchAccountInfo from '.';

beforeAll((done) => {
  beforeAllSetup(done);
});

afterAll((done) => {
  afterAllSetup(done);
});

describe('fetchAccountInfo', () => {
  test('ctrader', async () => {
    const config = await getConfig('ctrader');
    const { balance, providerData } = await fetchAccountInfo({
      providerId: 'ctrader',
      providerType: ProviderType.icmarkets,
      providerPlatform: ProviderPlatform.ctrader,
      options: { config },
    });
    Logger.info('Got balance:', balance);
    expect(balance).toBeDefined();
    expect(providerData).toBeDefined();

    const { accountId, traderLogin, leverage } = providerData;
    expect(accountId).toBeDefined();
    expect(traderLogin).toBeDefined();
    expect(leverage).toBeDefined();
  });

  test('metatrader', async () => {
    const config = await getConfig('meta');
    const { balance, providerData } = await fetchAccountInfo({
      providerId: 'meta',
      providerType: ProviderType.exness,
      providerPlatform: ProviderPlatform.ctrader,
      options: { config },
    });
    Logger.info('Got balance:', balance);
    expect(balance).toBeDefined();
    expect(providerData).toBeDefined();

    const { login, leverage } = providerData;
    expect(login).toBeDefined();
    expect(leverage).toBeDefined();
  });
});
