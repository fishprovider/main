import type { PromiseCreator } from '~types/PromiseCreator.model';

function promiseCreator<T>() {
  let resolveExec: ((val?: T) => void) = () => undefined;
  let rejectExec : ((reason?: any) => void) = () => undefined;

  const promise = new Promise<T | undefined>((resolve, reject) => {
    resolveExec = (val?: T) => resolve(val || undefined);
    rejectExec = reject;
  });

  const newPromise: PromiseCreator<T | undefined> = Object.assign(
    promise,
    { resolveExec, rejectExec },
  );
  return newPromise;
}

export default promiseCreator;
