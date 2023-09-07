import { log } from '..';

export type PromiseFn<T> = () => Promise<T>;

export interface QueuePromise {
  add<T>(promiseFn: PromiseFn<T>): T;
  pause(): void;
  clear(): void;
  onIdle(): Promise<void>;
}

const start = async (options?: {
  name?: string;
  concurrency?: number;
  sizeError?: number;
  sizeErrorStep?: number;
  sizeWarn?: number;
  sizeWarnStep?: number;
  onAdd?: () => void;
  onStart?: () => void;
  onSuccess?: (_: any) => void;
  onError?: (_: any) => void;
  onFinally?: () => void;
}) => {
  const { default: PQueue } = await import('p-queue');
  const pQueue = new PQueue({ concurrency: options?.concurrency || 1 });

  pQueue.on('add', () => {
    const numTasks = pQueue.size + pQueue.pending;
    if (options?.sizeError && numTasks >= options?.sizeError
        && numTasks % (options?.sizeErrorStep || 1) === 0) {
      log.error(`[${options?.name}] Too long queue tasks, waiting: ${pQueue.size}, running: ${pQueue.pending}`);
    }
    if (options?.sizeWarn && numTasks > options?.sizeWarn
        && numTasks % (options?.sizeWarnStep || 1) === 0) {
      log.warn(`[${options?.name}] Long queue tasks, waiting: ${pQueue.size}, running: ${pQueue.pending}`);
    }
    if (options?.onAdd) {
      options.onAdd();
    }
  });

  pQueue.on('active', () => {
    if (options?.onStart) {
      options.onStart();
    }
  });

  pQueue.on('completed', (result) => {
    if (result?.error) {
      log.error('Promise queue completed with error', result);
    }
    if (options?.onSuccess) {
      options.onSuccess(result);
    }
  });

  pQueue.on('error', (err) => {
    log.error('Promise queue error', err);
    if (options?.onError) {
      options.onError(err);
    }
  });

  pQueue.on('next', () => {
    if (options?.onFinally) {
      options.onFinally();
    }
  });

  return pQueue as QueuePromise;
};

const destroy = async (pQueue: QueuePromise) => {
  await pQueue.onIdle();
};

export const queuePromises = async <T>(
  promiseFns: (() => Promise<T>)[],
  options?: {
    name?: string;
    concurrency?: number;
  },
) => {
  const pQueue = await start(options);
  try {
    const promises = promiseFns.map((promiseFn) => pQueue.add(promiseFn));
    await pQueue.onIdle();
    const results = await Promise.all(promises);
    return results;
  } finally {
    await destroy(pQueue);
  }
};
