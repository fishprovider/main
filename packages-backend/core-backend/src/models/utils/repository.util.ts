export type Projection<T> = Partial<Record<keyof T | string, 0 | 1>>;
export type Sort = { [key: string]: 1 | -1 | 'asc' | 'desc' };

export interface BaseGetOptions<T> {
  projection?: Projection<T>,
  sort?: Sort,
  initializeCache?: boolean,
  revalidateCache?: boolean,
}

export interface BaseUpdateOptions<T> extends BaseGetOptions<T> {
  returnAfter?: boolean,
}

export interface BaseGetResult<T> {
  doc?: Partial<T>;
}

export interface BaseUpdateResult<T> extends BaseGetResult<T> {
  matchedCount?: number;
  modifiedCount?: number;
}

export interface BaseGetManyResult<T> {
  docs?: Partial<T>[];
}
