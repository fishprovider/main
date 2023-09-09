export interface PromiseCreator<T> extends Promise<T> {
  resolveExec: ((val: T) => void);
  rejectExec : ((reason?: any) => void);
}

export const promiseCreator = <T>(): PromiseCreator<T> => {
  let resolveExec: ((val: T) => void) = () => undefined;
  let rejectExec : ((reason?: any) => void) = () => undefined;

  const promise = new Promise<T>((resolve, reject) => {
    resolveExec = (val: T) => resolve(val);
    rejectExec = reject;
  });

  const promiseCustom = Object.assign(
    promise,
    { resolveExec, rejectExec },
  );

  return promiseCustom;
};
