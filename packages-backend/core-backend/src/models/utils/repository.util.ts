export type Projection<T> = Partial<Record<keyof T | string, 0 | 1>>;
export type Sort = { [key: string]: 1 | -1 | 'asc' | 'desc' };

export interface BaseGetOptions<T> {
  projection?: Projection<T>,
  sort?: Sort,
  expireSec?: number,
  reloadSec?: number,
}

export interface BaseUpdateOptions<T> extends BaseGetOptions<T> {
  returnAfter?: boolean,
}

export interface BaseGetResult<T> {
  doc?: Partial<T>;
  at?: Date;
}

export interface BaseCheckResult<T> extends BaseGetResult<T> {
  found: boolean;
  count?: number;
}

export interface BaseUpdateResult<T> extends BaseGetResult<T> {
  matchedCount?: number;
  modifiedCount?: number;
}

export interface BaseGetManyResult<T> {
  docs?: Partial<T>[];
  docsObj?: Record<string, Partial<T>>;
  at?: Date;
}
