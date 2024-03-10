export type Projection<T> = Partial<Record<keyof T | string, 0 | 1>>;
export type Sort = { [key: string]: 1 | -1 | 'asc' | 'desc' };

export interface RepositoryGetOptions<T> {
  projection?: Projection<T>,
  sort?: Sort,
}

export interface RepositoryUpdateOptions<T> extends RepositoryGetOptions<T> {
}

export interface RepositoryGetResult<T> {
  doc?: Partial<T>;
}

export interface RepositoryUpdateResult<T> extends RepositoryGetResult<T> {
}

export interface RepositoryGetManyResult<T> {
  docs?: Partial<T>[];
}
