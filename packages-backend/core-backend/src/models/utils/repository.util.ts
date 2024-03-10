export type Projection<T> = Partial<Record<keyof T | string, 0 | 1>>;
export type Sort = { [key: string]: 1 | -1 | 'asc' | 'desc' };

export interface RepositoryGetOptions<T> {
  projection?: Projection<T>,
  sort?: Sort,
  expireSec?: number,
  reloadSec?: number,
}

export interface RepositoryUpdateOptions<T> extends RepositoryGetOptions<T> {
  returnAfter?: boolean,
}

export interface RepositoryGetResult<T> {
  doc?: Partial<T>;
  at?: Date;
}

export interface RepositoryCheckResult<T> extends RepositoryGetResult<T> {
  found: boolean;
  count?: number;
}

export interface RepositoryUpdateResult<T> extends RepositoryGetResult<T> {
  matchedCount?: number;
  modifiedCount?: number;
}

export interface RepositoryGetManyResult<T> {
  docs?: Partial<T>[];
  docsObj?: Record<string, Partial<T>>;
  at?: Date;
}
