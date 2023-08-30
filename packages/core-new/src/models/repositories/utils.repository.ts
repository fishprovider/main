export type Projection<T> = Partial<Record<keyof T, 0 | 1>>;

export interface BaseGetOptions<T> {
  projection?: Projection<T>
}

export interface BaseUpdateOptions<T> extends BaseGetOptions<T> {
  returnAfter?: boolean,
}

export interface BaseGetResult<T> {
  doc?: Partial<T> | null;
}

export interface BaseGetManyResult<T> {
  docs: Partial<T>[];
}

export interface BaseUpdateResult<T> {
  matchedCount?: number;
  modifiedCount?: number;
  doc?: Partial<T> | null;
}
