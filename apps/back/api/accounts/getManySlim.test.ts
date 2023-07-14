import { afterAllSetup, beforeAllSetup } from '@fishprovider/swap/dist/tests/utils';
import { jest } from '@jest/globals';

import accountGetManySlim from './getManySlim';

beforeAll((done) => {
  beforeAllSetup(done);
});

afterAll((done) => {
  afterAllSetup(done);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('accountGetManySlim', () => {
  test('getManySlim', async () => {
    const { result } = await accountGetManySlim();
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });
});
