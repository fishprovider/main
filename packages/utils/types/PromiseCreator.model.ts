interface PromiseCreator<T> extends Promise<T> {
  resolveExec: ((val?: T) => void);
  rejectExec : ((reason?: any) => void);
}

export type { PromiseCreator };
