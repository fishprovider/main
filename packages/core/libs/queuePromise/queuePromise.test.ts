import { jest } from '@jest/globals';

import { destroy, start } from './queuePromise';

test('queuePromise', async () => {
  const foo = jest.fn();
  let pQueue;
  try {
    pQueue = await start();
    pQueue.add(async () => foo());
    pQueue.add(async () => foo());
    await pQueue.onIdle();
    expect(foo).toBeCalledTimes(2);
  } finally {
    if (pQueue) {
      await destroy(pQueue);
    }
  }
});
