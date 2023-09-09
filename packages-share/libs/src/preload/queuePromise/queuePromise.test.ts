import { jest } from '@jest/globals';

import { queuePromises } from './queuePromise';

test('queuePromise', async () => {
  const foo = jest.fn();
  const promiseFn = async () => foo();
  await queuePromises([
    promiseFn,
    promiseFn,
  ]);
  expect(foo).toBeCalledTimes(2);
});
