import type { QueuePromise } from './queuePromise';
import { destroy, start } from './queuePromise';

const runPromises = async <T>(promises: Promise<T>[], options?: {
  name?: string;
  concurrency?: number;
}) => {
  let pQueue: QueuePromise | undefined;
  try {
    pQueue = await start(options);
    const resultPromises = promises.map((promise) => new Promise<T>((resolve) => {
      pQueue?.add(async () => {
        const result = await promise;
        resolve(result);
      });
    }));
    await pQueue.onIdle();
    const results = await Promise.all(resultPromises);
    return results;
  } finally {
    if (pQueue) {
      await destroy(pQueue);
    }
  }
};

export default runPromises;
