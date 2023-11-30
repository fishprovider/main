export type Projection<T> = Partial<Record<keyof T | string, 0 | 1>>;
export type Sort = { [key: string]: 1 | -1 | 'asc' | 'desc' };

export interface BaseGetOptions<T> {
  projection?: Projection<T>,
  sort?: Sort,
}

export interface BaseUpdateOptions<T> extends BaseGetOptions<T> {
}

export interface BaseGetResult<T> {
  doc?: Partial<T>;
}

export interface BaseUpdateResult<T> extends BaseGetResult<T> {
}

export interface BaseGetManyResult<T> {
  docs?: Partial<T>[];
}
