import { jest } from '@jest/globals';

import { afterAllSetup, beforeAllSetup } from '~tests/utils';

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
