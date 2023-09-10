import { ProviderType } from '@fishprovider/utils/dist/constants/account';
import { jest } from '@jest/globals';

import { afterAllSetup, beforeAllSetup } from '~tests/utils';

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
