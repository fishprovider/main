interface QueuePromise {
  add(_: () => Promise<any>): void;
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
      Logger.error(`[${options?.name}] Too long queue tasks, waiting: ${pQueue.size}, running: ${pQueue.pending}`);
    }
    if (options?.sizeWarn && numTasks > options?.sizeWarn
        && numTasks % (options?.sizeWarnStep || 1) === 0) {
      Logger.warn(`[${options?.name}] Long queue tasks, waiting: ${pQueue.size}, running: ${pQueue.pending}`);
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
      Logger.error('Promise queue completed with error', result);
    }
    if (options?.onSuccess) {
      options.onSuccess(result);
    }
  });

  pQueue.on('error', (err) => {
    Logger.error('Promise queue error', err);
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

export { destroy, start };

export type { QueuePromise };
