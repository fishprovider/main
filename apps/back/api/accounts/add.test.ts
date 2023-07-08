import { afterAllSetup, beforeAllSetup } from '@fishprovider/swap/tests/utils';
import { ProviderTradeType, ProviderType } from '@fishprovider/utils/constants/account';
import { jest } from '@jest/globals';

import accountAdd from './add';

beforeAll((done) => {
  beforeAllSetup(done);
});

afterAll((done) => {
  afterAllSetup(done);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('accountAdd', () => {
  test('mt4', async () => {
    await accountAdd({
      data: {
        accountToNew: {
          name: 'test',
          providerType: ProviderType.exness,
          providerTradeType: ProviderTradeType.demo,
          config: {
            clientId: '',
            clientSecret: '',
            user: '69358719',
            pass: 'Test1234',
            platform: 'mt4',
            server: 'Exness-Trial8',
          },
        },
      },
      userInfo: {
        _id: 'test',
        uid: 'test',
        email: 'test@abc.comf',
        name: 'test',
      },
    });
  });
});
